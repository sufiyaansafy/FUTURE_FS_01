import { skills } from '../data/profile.js'
import Section from './Section.jsx'

export default function Skills() {
  return (
    <Section id="skills" title="Skills" lead="What I work with, from my degree, certifications and projects.">
      <dl className="skill-table">
        {skills.map((group) => (
          <div key={group.group} className="skill-row">
            <dt>{group.group}</dt>
            <dd>
              <ul className="slash-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
