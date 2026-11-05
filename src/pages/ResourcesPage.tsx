import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { mediaUrl, useManifest, type ResourceDoc } from '../lib/manifest'

// Follow the programme from its pedagogical foundations to practical tools
// and the collected volume. Each result uses only the active language's PDFs.
const RESULT_CATEGORIES = [
  'curriculum',
  'handbook',
  'training_plan',
  'activities',
  'practice',
  'cards',
  'templates',
  'book',
] as const

const MORE_CATEGORIES = ['lesson_plan', 'worksheet', 'hw', 'questions', 'summary'] as const

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v5h5" />
      <path d="M15 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
    </svg>
  )
}

function DownloadArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

function FileLink({ doc }: { doc: ResourceDoc }) {
  return (
    <a href={mediaUrl(doc.file)} download={doc.download}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand/10">
      <DocIcon className="h-5 w-5 shrink-0 text-brand" />
      <span className="flex min-w-0 flex-1 flex-col">
        {doc.group && (
          <span className="text-xs font-semibold uppercase tracking-wide text-brand/80">
            {doc.group}
          </span>
        )}
        <span className="break-words">{doc.title}</span>
      </span>
      <DownloadArrow className="h-4 w-4 shrink-0 text-muted" />
    </a>
  )
}

function ResultCard({ category, title, paragraphs, docs }: {
  category: string
  title: string
  paragraphs: readonly string[]
  docs: ResourceDoc[]
}) {
  const { t } = useTranslation()

  return (
    <article aria-labelledby={`result-${category}`}
      className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
      <h2 id={`result-${category}`}
        className="font-display text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-3 leading-relaxed text-ink">
        {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <ul className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
        {docs.map((doc) => (
          <li key={doc.file} className="max-w-full">
            <a href={mediaUrl(doc.file)} download={doc.download}
              aria-label={t('resources.downloadDocument', { title: doc.title })}
              className="inline-flex max-w-full items-center gap-3 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
              <DocIcon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 break-words">
                {docs.length === 1 ? t('resources.download') : doc.title}
              </span>
              <DownloadArrow className="h-5 w-5 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}

function MaterialPanel({ title, docs }: { title: string; docs: ResourceDoc[] }) {
  return (
    <details className="group rounded-2xl border border-ink/10 bg-white/60 px-5 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 font-display font-bold text-ink [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
          {docs.length}
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="ml-auto h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <ul className="border-t border-ink/10 py-2">
        {docs.map((doc) => <li key={doc.file}><FileLink doc={doc} /></li>)}
      </ul>
    </details>
  )
}

export default function ResourcesPage() {
  const { t, i18n } = useTranslation()
  const { data, error } = useManifest()
  const language = (i18n.resolvedLanguage ?? 'en').slice(0, 2)
  const paragraphs = t('resources.paragraphs', { returnObjects: true }) as string[]
  const descriptions = t('resources.results', { returnObjects: true }) as Record<
    (typeof RESULT_CATEGORIES)[number], string[]
  >
  const docsFor = (category: string) => data?.resources[category]?.[language] ?? []
  const results = RESULT_CATEGORIES.map((category) => ({ category, docs: docsFor(category) }))
    .filter(({ docs }) => docs.length > 0)
  const morePanels = MORE_CATEGORIES.map((category) => ({ category, docs: docsFor(category) }))
    .filter(({ docs }) => docs.length > 0)

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t('resources.title')}
      </h1>
      <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink">
        {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {!data && (
        <p role="status" className="mt-10 text-center text-muted">
          {t(error ? 'resources.loadError' : 'resources.loading')}
        </p>
      )}
      <div className="mt-10 space-y-6">
        {results.map(({ category, docs }) => (
          <ResultCard key={category} category={category}
            title={t(`resources.categories.${category}`)}
            paragraphs={descriptions[category]} docs={docs} />
        ))}
      </div>
      {morePanels.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
            {t('resources.more')}
          </h2>
          <div className="mt-4 space-y-3">
            {morePanels.map(({ category, docs }) => (
              <MaterialPanel key={category} title={t(`resources.categories.${category}`)} docs={docs} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-12 flex justify-center">
        <Link to="/"
          className="rounded-full border-2 border-brand px-6 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white">
          {t('brand')}
        </Link>
      </div>
    </section>
  )
}
