// Initialise i18next before anything renders so the first paint is localized.
import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadManifest } from './lib/manifest'
import { applyCachedBackground, applyManifestTheme } from './lib/theme'

// Background colour: paint the cached one right away (index.html already did this
// before first paint; this covers a stripped/missing inline script), then let the
// CMS manifest have the final say. The colour is set only in the CMS (cms.php).
applyCachedBackground()
loadManifest().then(
  (m) => applyManifestTheme(m.theme),
  () => {
    /* Manifest unavailable — keep the cached/default colour. */
  },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
