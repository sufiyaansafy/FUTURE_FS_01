import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// In production the HTML is pre-rendered at build time (see scripts/prerender.js),
// so React "hydrates" it: attaches event handlers to markup that's already there.
// In development the root is empty, so React renders from scratch.
if (container.firstElementChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
