import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` emits relative asset URLs so the static build works at any path
// or host without extra config — GitHub Pages project sites, Netlify, Cloudflare
// Pages, or even opened straight from the filesystem.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
