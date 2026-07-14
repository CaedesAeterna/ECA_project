import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Every resource PDF, discovered at build time and grouped by its folder path
// "resources/<category>/<lang>/[.../]<file>.pdf". The glob is recursive (**) so
// nested project folders (e.g. the HU "Paradicsom" lesson series) are included.
// WordPress is gone, so all of these are bundled and served locally; drop a new
// file into the right <category>/<lang>/ folder and it is picked up automatically.
const modules = import.meta.glob('../assets/resources/**/*.pdf', {
  eager: true,
  import: 'default',
}) as Record<string, string>

type Doc = { url: string; label: string; group?: string; download: string }

const PREFIX = '../assets/resources/'

// Turn a filename into a readable label: drop the extension and a leading
// "ECA"/"Eca" prefix, and show underscores as spaces.
function cleanLabel(file: string): string {
  return file
    .replace(/\.pdf$/i, '')
    .replace(/^ECA[\s_-]*/i, '')
    .replace(/_/g, ' ')
    .trim()
}

// category -> language -> documents, built once from the glob above.
const catalogue: Record<string, Record<string, Doc[]>> = {}
for (const [path, url] of Object.entries(modules)) {
  const segments = path.slice(PREFIX.length).split('/')
  if (segments.length < 3) continue // need at least <category>/<lang>/<file>
  const category = segments[0]
  const lang = segments[1]
  const rest = segments.slice(2) // any sub-folders, then the filename
  const file = rest[rest.length - 1]
  const parent = rest.length > 1 ? rest[rest.length - 2] : undefined
  const byLang = (catalogue[category] ??= {})
  ;(byLang[lang] ??= []).push({
    url,
    label: cleanLabel(file),
    group: parent, // immediate sub-folder, used to keep project lessons together
    download: file, // keep the author's own filename for the bulk materials
  })
}

// Natural sort within each list, grouped items last, so "LP2" precedes "LP13"
// and the numbered "Paradicsom" lessons stay in order.
for (const langs of Object.values(catalogue)) {
  for (const docs of Object.values(langs)) {
    docs.sort(
      (a, b) =>
        (a.group ?? '').localeCompare(b.group ?? '', undefined, { numeric: true }) ||
        a.label.localeCompare(b.label, undefined, { numeric: true }),
    )
  }
}

function docsFor(category: string, lang: string): Doc[] {
  return catalogue[category]?.[lang] ?? []
}

// Clean download filenames for the two flagship documents, independent of the
// (messy) source names.
const DOWNLOAD_NAME: Record<string, { handbook: string; curriculum: string }> = {
  en: { handbook: 'ECA_Handbook_EN.pdf', curriculum: 'ECA_Curriculum_EN.pdf' },
  hu: { handbook: 'ECA_tanari_kezikonyv_HU.pdf', curriculum: 'ECA_tanterv_HU.pdf' },
  pl: { handbook: 'ECA_Podrecznik_PL.pdf', curriculum: 'ECA_Program_nauczania_PL.pdf' },
}

// Extra material types shown as collapsible panels, in this display order.
const MORE_CATEGORIES = ['lesson_plan', 'worksheet', 'hw', 'questions'] as const

// Document (file) icon.
function DocIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3v5h5" />
      <path d="M15 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
    </svg>
  )
}

// Down-arrow (download) icon.
function DownloadArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

// Chevron used as the accordion open/close indicator.
function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// One prominent download card for a flagship PDF (handbook or curriculum).
function DownloadCard({
  href,
  download,
  title,
  subtitle,
}: {
  href: string
  download: string
  title: string
  subtitle: string
}) {
  return (
    <a
      href={href}
      download={download}
      className="group flex items-center gap-4 rounded-2xl border-2 border-brand bg-brand/5 px-6 py-5 text-ink transition-colors hover:bg-brand hover:text-white"
    >
      <DocIcon className="h-9 w-9 shrink-0 text-brand group-hover:text-white" />
      <span className="flex flex-col">
        <span className="font-display text-lg font-extrabold tracking-tight">{title}</span>
        <span className="text-sm text-muted group-hover:text-white/80">{subtitle}</span>
      </span>
      <DownloadArrow className="ml-auto h-6 w-6 shrink-0" />
    </a>
  )
}

// A single downloadable file row inside an accordion panel.
function FileLink({ doc }: { doc: Doc }) {
  return (
    <a
      href={doc.url}
      download={doc.download}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand/10"
    >
      <DocIcon className="h-5 w-5 shrink-0 text-brand" />
      <span className="flex min-w-0 flex-1 flex-col">
        {doc.group && (
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-brand/80">
            {doc.group}
          </span>
        )}
        <span className="truncate">{doc.label}</span>
      </span>
      <DownloadArrow className="h-4 w-4 shrink-0 text-muted" />
    </a>
  )
}

// A collapsible panel listing every file of one material type (native <details>,
// so it works without JS and is keyboard-accessible).
function MaterialPanel({ title, docs }: { title: string; docs: Doc[] }) {
  return (
    <details className="group rounded-2xl border border-ink/10 bg-white/60 px-5 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 font-display font-bold text-ink [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
          {docs.length}
        </span>
        <Chevron className="ml-auto h-5 w-5 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <ul className="border-t border-ink/10 py-2">
        {docs.map((doc, i) => (
          <li key={i}>
            <FileLink doc={doc} />
          </li>
        ))}
      </ul>
    </details>
  )
}

export default function ResourcesPage() {
  const { t, i18n } = useTranslation()

  // Body copy and the two feature cards are stored in the locale files.
  const paragraphs = t('resources.paragraphs', { returnObjects: true }) as string[]
  const items = t('resources.items', { returnObjects: true }) as {
    title: string
    body: string
  }[]

  // Serve the material set matching the active UI language, English as fallback
  // for the two flagship documents. The extra materials are language-specific:
  // a panel simply doesn't appear if that language has no files yet.
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2)
  const handbook = docsFor('handbook', lang)[0] ?? docsFor('handbook', 'en')[0]
  const curriculum = docsFor('curriculum', lang)[0] ?? docsFor('curriculum', 'en')[0]
  const names = DOWNLOAD_NAME[lang] ?? DOWNLOAD_NAME.en

  const morePanels = MORE_CATEGORIES.map((cat) => ({
    cat,
    docs: docsFor(cat, lang),
  })).filter((panel) => panel.docs.length > 0)

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t('resources.title')}
      </h1>

      <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* The two building blocks described in the handbook. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-brand">
              {item.title}
            </h2>
            <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Language-matched flagship downloads: teacher handbook + curriculum. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {handbook && (
          <DownloadCard
            href={handbook.url}
            download={names.handbook}
            title={t('resources.handbook')}
            subtitle={t('resources.download')}
          />
        )}
        {curriculum && (
          <DownloadCard
            href={curriculum.url}
            download={names.curriculum}
            title={t('resources.curriculum')}
            subtitle={t('resources.download')}
          />
        )}
      </div>

      {/* Collapsible panels for the remaining material types (lesson plans,
          worksheets, homework, question collections). Hidden entirely when the
          active language has none of them. */}
      {morePanels.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
            {t('resources.more')}
          </h2>
          <div className="mt-4 space-y-3">
            {morePanels.map(({ cat, docs }) => (
              <MaterialPanel key={cat} title={t(`resources.categories.${cat}`)} docs={docs} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom button: the 3-letter wordmark, back to the home page. */}
      <div className="mt-12 flex justify-center">
        <Link
          to="/"
          className="rounded-full border-2 border-brand px-6 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {t('brand')}
        </Link>
      </div>
    </section>
  )
}
