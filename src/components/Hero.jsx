import { facts, profile, stackLayers } from '../data/profile.js'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-name" className="hero-name">
              <span>{profile.firstNames}</span> <span>{profile.lastNames}</span>
            </h1>
            <p className="hero-role">{profile.role}</p>
            <p className="hero-tagline">{profile.tagline}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View my work
              </a>
              <a className="button button-outline" href="#contact">
                Get in touch
              </a>
              <ul className="hero-socials" aria-label="Find me online">
                <li>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <GitHubIcon />
                  </a>
                </li>
                <li>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <LinkedInIcon />
                  </a>
                </li>
                <li>
                  <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
                    <MailIcon />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* The signature element: the full stack, drawn as three layers. */}
          <figure className="stack" aria-labelledby="stack-caption">
            <ol className="stack-layers">
              {stackLayers.map((layer) => (
                <li key={layer.layer} className={`layer layer-${layer.tone}`}>
                  <span className="layer-name">{layer.layer}</span>
                  <span className="layer-items">{layer.items.join(', ')}</span>
                </li>
              ))}
            </ol>
            <figcaption id="stack-caption">The stack I build with, from the screen down to the data.</figcaption>
          </figure>
        </div>

        <dl className="facts">
          {facts.map((fact) => (
            <div key={fact.term} className="fact">
              <dt>{fact.term}</dt>
              <dd>{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
