// Runtime content index. The PHP CMS owns server/media/manifest.json on the
// host; the site fetches it at runtime (no rebuild needed when content changes).
// In dev a Vite middleware serves /media from server/media (see vite.config.ts).
import { useEffect, useState } from 'react'
import type { Theme } from './theme'

// A content block for an event report: paragraph, lead paragraph, sub-heading,
// bullet list, or a signature line. Bodies are per language; PL falls back to EN.
export type Block =
  | string
  | { lead: string }
  | { h: string }
  | { list: string[] }
  | { sig: string }

export type ResourceDoc = {
  file: string // media-relative path, e.g. "resources/handbook/hu/x.pdf"
  title: string // human label shown in the UI
  group?: string // immediate sub-folder, keeps project lessons together
  download: string // friendly filename for the download attribute
}

export type EventEntry = {
  id: string
  date: string
  title: { hu: string; en: string }
  body: { hu: Block[]; en: Block[] }
  images: string[] // media-relative paths
}

export type Manifest = {
  version: number
  updatedAt: string
  resources: Record<string, Record<string, ResourceDoc[]>>
  events: { hu: EventEntry[]; pl: EventEntry[] }
  /** Look & feel set in the CMS (currently the page background colour). */
  theme?: Theme
}

// Absolute URL for a media-relative path, resolved against the document base so
// it works both in dev (localhost) and in production (served next to index.html,
// even under the HashRouter's "/#/..." URLs).
export function mediaUrl(rel: string): string {
  return new URL('media/' + rel.replace(/^\/+/, ''), document.baseURI).href
}

// Fetch the manifest once and cache the promise for the whole session.
let cache: Promise<Manifest> | null = null
export function loadManifest(): Promise<Manifest> {
  if (!cache) {
    cache = fetch(mediaUrl('manifest.json'), { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(`manifest ${r.status}`)
      return r.json() as Promise<Manifest>
    })
  }
  return cache
}

// React hook: load the manifest, exposing data + error (null while loading).
export function useManifest(): { data: Manifest | null; error: unknown } {
  const [data, setData] = useState<Manifest | null>(null)
  const [error, setError] = useState<unknown>(null)
  useEffect(() => {
    let alive = true
    loadManifest().then(
      (m) => alive && setData(m),
      (e) => alive && setError(e),
    )
    return () => {
      alive = false
    }
  }, [])
  return { data, error }
}
