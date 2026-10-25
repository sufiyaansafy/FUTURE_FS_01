import { useEffect, useState } from 'react'
import { profile } from '../data/profile.js'
import { CloseIcon, MenuIcon } from './Icons.jsx'
import StackMark from './StackMark.jsx'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#resume', label: 'Resume' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label={`${profile.name}, back to top`}>
          <StackMark />
          <span>{profile.shortName}</span>
        </a>

        <nav aria-label="Main" className={open ? 'nav is-open' : 'nav'} id="site-nav">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a className="nav-contact" href="#contact" onClick={() => setOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
    </header>
  )
}
