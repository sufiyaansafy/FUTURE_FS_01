// Sends a contact form message to the Supabase Edge Function in
// supabase/functions/contact. The function validates it, saves it to the
// contact_messages table and emails a notification.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export const contactFormReady = Boolean(supabaseUrl)

export async function sendMessage({ name, email, message, website }) {
  if (!supabaseUrl) {
    throw new Error('not-configured')
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, website }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.error || 'send-failed')
    error.status = response.status
    throw error
  }

  return data
}
