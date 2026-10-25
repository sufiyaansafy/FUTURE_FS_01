import { about, strengths } from '../data/profile.js'
import Section from './Section.jsx'

const tones = ['forest', 'crimson', 'charcoal']

export default function About() {
  const [lead, ...rest] = about
  return (
    <Section id="about" title="About me" lead="Who I am and what I’m working toward.">
      <p className="about-lead">{lead}</p>

      <div className="about-body">
        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <ul className="strengths">
        {strengths.map((item, i) => (
          <li key={item.title} className={`strength strength-${tones[i % tones.length]}`}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
