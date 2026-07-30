import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const MEDIA_ROOT = fileURLToPath(new URL('./server/media', import.meta.url))
const MIME: Record<string, string> = {
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

// Dev-only: serve the CMS-owned media tree (server/media) at /media so the app
// can fetch the manifest and files locally. In production these live next to
// index.html on the host and are never part of the Vite build.
function serveMediaDev(): Plugin {
  return {
    name: 'eca-serve-media-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/media/')) return next()
        const rel = decodeURIComponent(req.url.slice('/media/'.length).split('?')[0])
        const abs = normalize(join(MEDIA_ROOT, rel))
        if (!abs.startsWith(MEDIA_ROOT)) {
          res.statusCode = 400
          return res.end('bad path')
        }
        try {
          if (!statSync(abs).isFile()) return next()
          res.setHeader('Content-Type', MIME[extname(abs).toLowerCase()] ?? 'application/octet-stream')
          res.end(readFileSync(abs))
        } catch {
          next()
        }
      })
    },
  }
}

// `base: './'` emits relative asset URLs so the static build works at any path
// or host without extra config — GitHub Pages project sites, Netlify, Cloudflare
// Pages, or even opened straight from the filesystem.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), serveMediaDev()],
})
