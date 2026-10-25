// Supabase Edge Function: POST /functions/v1/contact
//
// 1. Validates the form data (never trust the browser).
// 2. Drops spam: if the hidden "website" field is filled in, a bot sent it.
// 3. Rate-limits: at most 3 messages per email address every 10 minutes.
// 4. Saves the message to public.contact_messages.
// 5. Emails a notification to you through Resend (https://resend.com).
//
// Secrets it needs (set with `supabase secrets set` or in the dashboard):
//   RESEND_API_KEY     your Resend API key
//   CONTACT_TO_EMAIL   where notifications go, e.g. sufiyaansafy11@gmail.com
//   CONTACT_FROM_EMAIL optional, defaults to Resend's test sender
// SUPABASE_URL and the project's secret key are provided automatically.
//
// Deploy with JWT verification OFF: this is a public form, so visitors have no login.
// The checks below (validation, honeypot, rate limit) are what protect it instead.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, authorization, apikey, x-client-info',
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Supabase is replacing the legacy service_role key with named secret keys.
// Use the new default secret key when it exists, and fall back to the legacy one.
function serverKey() {
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (secretKeys) {
    try {
      const keys = JSON.parse(secretKeys) as Record<string, string>
      const key = keys.default ?? Object.values(keys)[0]
      if (key) return key
    } catch {
      // Not valid JSON; try the legacy key below.
    }
  }
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacy) return legacy
  throw new Error('No Supabase secret key is available to this function.')
}

const EMAIL_PATTERN =/^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function sendNotification(name: string, email: string, message: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('CONTACT_TO_EMAIL')
  if (!apiKey || !to) {
    console.warn('RESEND_API_KEY or CONTACT_TO_EMAIL is not set; skipping the email.')
    return false
  }

  const from = Deno.env.get('CONTACT_FROM_EMAIL') ?? 'Portfolio <onboarding@resend.dev>'

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `New portfolio message from ${name}`,
      text: `${name} <${email}> wrote:\n\n${message}`,
      html: `
        <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) sent a message from your portfolio:</p>
        <blockquote style="border-left:3px solid #6a4fc0;margin:0;padding:8px 16px;white-space:pre-wrap">${escapeHtml(message)}</blockquote>
        <p>Reply to this email to answer them directly.</p>
      `,
    }),
  })

  if (!response.ok) {
    console.error('Resend error', response.status, await response.text())
    return false
  }
  return true
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Send the form data as JSON.' }, 400)
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const message = String(body.message ?? '').trim()
  const website = String(body.website ?? '').trim()

  // Honeypot filled in: pretend it worked so the bot moves on, but save nothing.
  if (website) return json({ ok: true })

  if (name.length < 2 || name.length > 100) return json({ error: 'Enter your name.' }, 400)
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return json({ error: 'Enter a valid email.' }, 400)
  if (message.length < 10 || message.length > 5000) {
    return json({ error: 'Write a message between 10 and 5000 characters.' }, 400)
  }

  // Server-side client: the secret key bypasses Row Level Security, which is why
  // it only ever lives here and never in the browser.
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serverKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count, error: countError } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', tenMinutesAgo)

  if (countError) {
    console.error(countError)
    return json({ error: 'Could not save your message.' }, 500)
  }
  if ((count ?? 0) >= 3) return json({ error: 'Too many messages. Try again in 10 minutes.' }, 429)

  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message })
    .select('id')
    .single()

  if (error) {
    console.error(error)
    return json({ error: 'Could not save your message.' }, 500)
  }

  const emailed = await sendNotification(name, email, message)
  if (emailed) {
    await supabase.from('contact_messages').update({ emailed: true }).eq('id', data.id)
  }

  // The message is saved either way, so the visitor sees success even if the email failed.
  return json({ ok: true })
})
