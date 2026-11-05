import publishedResources from '../data/project-results.json'
import { mediaUrl, type Manifest, type ResourceDoc } from './manifest'

// Published project results travel with the app, including their PDFs. Older
// CMS manifests may not have the categories introduced by a newer release.
// This snapshot is outside server/media so the CMS backup cannot erase it.
export const RESULT_CATEGORIES = [
  'curriculum',
  'handbook',
  'training_plan',
  'activities',
  'practice',
  'cards',
  'templates',
  'book',
] as const

const publishedFiles = import.meta.glob<string>('../assets/project-results/**/*.pdf', {
  eager: true, query: '?url', import: 'default',
})

export type ProjectResultDoc = ResourceDoc & { url: string }

export function getProjectResults(resources: Manifest['resources'] | undefined, language: string) {
  const published = publishedResources as Manifest['resources']

  return RESULT_CATEGORIES.map((category) => {
    const liveDocs = resources?.[category]?.[language]
    // An explicit empty list is a CMS deletion; only absent keys use the release.
    const usePublished = liveDocs === undefined
    const docs = liveDocs ?? published[category]?.[language] ?? []

    return {
      category,
      docs: docs.map((doc): ProjectResultDoc => {
        const fileUrl = usePublished
          ? publishedFiles[`../assets/project-results/${doc.file.replace(/^resources\//, '')}`]
          : mediaUrl(doc.file)
        if (!fileUrl) throw new Error(`Missing published project result: ${doc.file}`)
        return { ...doc, url: new URL(fileUrl, document.baseURI).href }
      }),
    }
  }).filter(({ docs }) => docs.length > 0)
}
