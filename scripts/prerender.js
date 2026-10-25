// Runs after `vite build`. Renders the React app to plain HTML and writes it into
// dist/index.html, so search engines and link previews see real content without
// running JavaScript. It also fills in the site's public URL everywhere it's needed.
//
// Set SITE_URL in your hosting provider (e.g. Vercel) if your address differs from the default.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, '.ssr-build')

// Read .env when building locally (hosting providers set real environment variables).
try {
  process.loadEnvFile(path.join(root, '.env'))
} catch {
  // No .env file; fall back to the default below.
}

const SITE_URL =(process.env.SITE_URL || 'https://sufiyaansafy.vercel.app').replace(/\/$/, '')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const appHtml = render()

const indexPath = path.join(dist, 'index.html')
let html = fs.readFileSync(indexPath, 'utf8')
if (!html.includes('<!--app-html-->')) {
  throw new Error('Could not find <!--app-html--> in dist/index.html')
}
html = html.replace('<!--app-html-->', appHtml)
fs.writeFileSync(indexPath, html.replaceAll('__SITE_URL__', SITE_URL))

for (const file of ['robots.txt', 'sitemap.xml']) {
  const filePath = path.join(dist, file)
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, fs.readFileSync(filePath, 'utf8').replaceAll('__SITE_URL__', SITE_URL))
  }
}

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`Pre-rendered dist/index.html for ${SITE_URL}`)
