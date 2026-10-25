import { profile } from '../data/profile.js'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p>
            Built with React, Vite and Supabase as Task 1 of my{' '}
            <a href="https://futureinterns.com" target="_blank" rel="noopener noreferrer">
              Future Interns
            </a>{' '}
            internship. © 2026
          </p>
        </div>
        <ul className="footer-socials" aria-label="Find me online">
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
    </footer>
  )
}
