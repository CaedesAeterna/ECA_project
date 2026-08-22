// Runtime background colour.
//
// Tailwind 4 emits every `@theme` token as a CSS custom property on `:root`
// (e.g. `--color-blush: #fce9e3`), and the utilities reference it as
// `var(--color-blush)`. So setting that one property as an inline style on the
// root element repaints the page background AND every `bg-blush` band at once —
// no rebuild, no redeploy, no reload.
//
// Where the colour comes from, in order:
//   1. `theme.background` in the CMS manifest — the only place it is set (cms.php)
//   2. `localStorage` — only a cache of the last applied colour, so the page can
//      paint the right background before the manifest arrives (no colour flash)
//   3. nothing set -> the CSS default in src/index.css stays untouched

// The token that paints the page background.
const VAR_BG = '--color-blush'
const STORAGE_KEY = 'eca:bg'

export type Theme = {
  /** Page background as `#rrggbb`; null/absent = use the built-in default. */
  background?: string | null
}

/** Normalise `#abc` / `#AABBCC` to `#aabbcc`; returns null if it isn't a hex colour. */
export function normalizeHex(value: string | null | undefined): string | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(v)) return v
  if (/^#[0-9a-f]{3}$/.test(v)) return '#' + [...v.slice(1)].map((c) => c + c).join('')
  return null
}

function root(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

/** Remember the colour so the next page load paints it before the manifest arrives. */
function cache(color: string | null): void {
  try {
    if (color) localStorage.setItem(STORAGE_KEY, color)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Private mode / blocked storage — the colour still applies for this page view.
  }
}

/**
 * Apply a background colour immediately. Pass a hex string (`#fce9e3`, `#abc`),
 * or null to fall back to the built-in default. Returns the applied colour.
 */
export function setBackground(color: string | null, opts: { persist?: boolean } = {}): string | null {
  const el = root()
  const hex = normalizeHex(color)
  const persist = opts.persist ?? true

  if (!el) return hex
  if (!hex) {
    // Remove the override -> the stylesheet's own value takes over again.
    el.style.removeProperty(VAR_BG)
    if (persist) cache(null)
    return null
  }
  el.style.setProperty(VAR_BG, hex)
  if (persist) cache(hex)
  return hex
}

/** The colour currently in force (null when the CSS default is showing). */
export function getBackground(): string | null {
  const el = root()
  return el ? normalizeHex(el.style.getPropertyValue(VAR_BG)) : null
}

/** Drop any custom colour and return to the built-in default. */
export function resetBackground(): void {
  setBackground(null)
}

/** Paint the cached colour at boot, before the manifest has loaded. */
export function applyCachedBackground(): void {
  try {
    setBackground(localStorage.getItem(STORAGE_KEY), { persist: false })
  } catch {
    // No storage access — nothing cached to apply.
  }
}

/**
 * Apply the colour from the CMS manifest. It is authoritative: an explicit
 * null/empty value clears a locally cached colour, so an admin resetting the
 * colour in the CMS also resets visitors who had the old one cached. A manifest
 * with no `theme` key at all leaves the current colour alone.
 */
export function applyManifestTheme(theme: Theme | undefined): void {
  if (!theme) return
  setBackground(normalizeHex(theme.background))
}
