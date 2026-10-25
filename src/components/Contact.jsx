import { useState } from 'react'
import { profile } from '../data/profile.js'
import { sendMessage } from '../lib/sendMessage.js'
import { CheckIcon, CopyIcon, GitHubIcon, LinkedInIcon, PhoneIcon, PinIcon } from './Icons.jsx'
import Section from './Section.jsx'

const empty = { name: '', email: '', message: '', website: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter an email address like name@example.com.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Write a message of at least 10 characters.'
  }
  return errors
}

function errorText(err) {
  if (err.message === 'not-configured') {
    return `The contact form isn’t connected yet. Email me at ${profile.email} instead.`
  }
  if (err.status === 429) {
    return 'You’ve sent a few messages in a short time. Wait 10 minutes and try again, or email me directly.'
  }
  if (err.status === 400) {
    return 'Some details look incomplete. Check the fields and send again.'
  }
  return `Your message didn’t send because of a connection problem. Try again, or email me at ${profile.email}.`
}

export default function Contact() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [failure, setFailure] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the email is still visible to copy by hand.
    }
  }

  function update(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = ['name', 'email', 'message'].find((f) => found[f])
      document.getElementById(`contact-${first}`)?.focus()
      return
    }

    setStatus('sending')
    try {
      await sendMessage(values)
      setSentTo(values.email.trim())
      setValues(empty)
      setStatus('sent')
    } catch (err) {
      setFailure(errorText(err))
      setStatus('failed')
    }
  }

  return (
    <Section
      id="contact"
      tone="dark"
      title="Get in touch"
      lead="Hiring for a graduate programme, internship or junior developer role? Send a message and it lands straight in my inbox."
    >
      <div className="contact-grid">
        <div className="contact-info">
          <p className="contact-email-label">Email me directly</p>
          <p className="contact-email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <button type="button" className="copy-button" onClick={copyEmail}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy email'}
          </button>
          <span className="visually-hidden" aria-live="polite">
            {copied ? 'Email address copied' : ''}
          </span>

          <ul className="contact-direct">
            <li>
              <PhoneIcon />
              <a href={profile.phoneHref}>{profile.phone}</a>
            </li>
            <li>
              <LinkedInIcon />
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <GitHubIcon />
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.githubLabel}
              </a>
            </li>
            <li>
              <PinIcon />
              <span>{profile.location}</span>
            </li>
          </ul>
        </div>

        {status === 'sent' ? (
          <div className="form-panel form-sent" role="status">
            <h3>Message sent</h3>
            <p>Thanks for reaching out. I’ll reply to {sentTo} soon.</p>
            <button type="button" className="button button-outline-light" onClick={() => setStatus('idle')}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="form-panel" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                maxLength={100}
              />
              {errors.name && (
                <p className="field-error" id="contact-name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={update}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                maxLength={200}
              />
              {errors.email && (
                <p className="field-error" id="contact-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                value={values.message}
                onChange={update}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                maxLength={5000}
              />
              {errors.message && (
                <p className="field-error" id="contact-message-error">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Honeypot: hidden from people, but spam bots fill it in. */}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={update}
              />
            </div>

            {status === 'failed' && (
              <p className="form-failure" role="alert">
                {failure}
              </p>
            )}

            <button type="submit" className="button button-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending message…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </Section>
  )
}
