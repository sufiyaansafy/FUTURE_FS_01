// Shared layout for every content section: the heading on the left and a short
// intro on the right on wide screens, stacked on phones. `tone="dark"` gives the
// section a charcoal background.
export default function Section({ id, title, lead, tone, children }) {
  const headingId = `${id}-heading`
  return (
    <section id={id} className={tone === 'dark' ? 'section section-dark' : 'section'} aria-labelledby={headingId}>
      <div className="container">
        <div className="section-head">
          <h2 id={headingId}>{title}</h2>
          {lead && <p className="section-lead">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
