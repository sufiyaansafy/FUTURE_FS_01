import { certifications, coursework, education } from '../data/profile.js'
import Section from './Section.jsx'

export default function Resume() {
  return (
    <Section id="resume" title="Resume" lead="Education, certifications and the subjects behind them.">
      <div className="resume-grid">
        <div className="resume-col resume-forest">
          <h3>Education</h3>
          {education.map((item) => (
            <div key={item.title} className="edu">
              <p className="edu-years">{item.when}</p>
              <p className="edu-title">{item.title}</p>
              <p className="edu-org">
                {item.org}, {item.place}
              </p>
              <p className="edu-note">{item.note}</p>
            </div>
          ))}
          <p className="resume-footnote">ID, licence and references available on request.</p>
        </div>

        <div className="resume-col resume-crimson">
          <h3>Certifications</h3>
          <ul className="cert-list">
            {certifications.map((cert) => (
              <li key={cert.title}>
                <p className="cert-title">{cert.title}</p>
                <p className="cert-org">
                  {cert.org}
                  <span className={cert.status === 'Completed' ? 'cert-status' : 'cert-status is-progress'}>
                    {cert.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="resume-col resume-charcoal">
          <h3>Coursework</h3>
          <ul className="course-list">
            {coursework.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
