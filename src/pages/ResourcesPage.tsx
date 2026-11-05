import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { mediaUrl, useManifest, type ResourceDoc } from '../lib/manifest'
import { getProjectResults, RESULT_CATEGORIES, type ProjectResultDoc } from '../lib/projectResults'

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

function ResultCard({ category, title, paragraphs, docs, position }: {
  category: string
  title: string
  paragraphs: readonly string[]
  docs: ProjectResultDoc[]
  position: number
}) {
  const { t } = useTranslation()

  return (
    <article aria-labelledby={`result-${category}`}
      className="min-w-0 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 font-display text-xs font-bold text-brand-dark">
          {String(position).padStart(2, '0')}
        </span>
        <h2 id={`result-${category}`}
          className="min-h-12 min-w-0 break-words font-display text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">
          {title}
        </h2>
      </div>
      <details className="group mt-3">
        <summary aria-label={t('resources.descriptionFor', { title })}
          className="cursor-pointer list-none rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true"
            className="line-clamp-3 min-h-15 text-sm leading-5 text-muted group-open:hidden">
            {paragraphs[0]}
          </span>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            <span className="group-open:hidden">{t('resources.readMore')}</span>
            <span className="hidden group-open:inline">{t('resources.readLess')}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-open:rotate-180">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </details>
      <ul className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-3">
        {docs.map((doc) => (
          <li key={doc.file} className="max-w-full">
            <a href={doc.url} download={doc.download}
              aria-label={t('resources.downloadDocument', { title: doc.title })}
              className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg border border-brand/25 bg-brand/10 px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
              <DocIcon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">
                {docs.length === 1 ? t('resources.download') : doc.title}
              </span>
              <DownloadArrow className="h-4 w-4 shrink-0" />
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
  const results = !data && !error ? [] : getProjectResults(data?.resources, language)
  const morePanels = MORE_CATEGORIES.map((category) => ({ category, docs: docsFor(category) }))
    .filter(({ docs }) => docs.length > 0)

  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-center font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {t('resources.title')}
      </h1>
      <div className="mx-auto mt-5 max-w-3xl space-y-3 text-center text-base leading-relaxed text-muted">
        {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {!data && (
        <p role="status" className="mt-10 text-center text-muted">
          {t(error ? 'resources.loadError' : 'resources.loading')}
        </p>
      )}
      <div className="mt-7 grid items-start gap-4 md:grid-cols-2">
        {results.map(({ category, docs }, index) => (
          <ResultCard key={category} category={category} position={index + 1}
            title={t(`resources.categories.${category}`)}
            paragraphs={descriptions[category]} docs={docs} />
        ))}
      </div>
      {morePanels.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
            {t('resources.more')}
          </h2>
          <div className="mt-4 grid items-start gap-3 md:grid-cols-2">
            {morePanels.map(({ category, docs }) => (
              <MaterialPanel key={category} title={t(`resources.categories.${category}`)} docs={docs} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-9 flex justify-center">
        <Link to="/"
          className="rounded-full border-2 border-brand px-6 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white">
          {t('brand')}
        </Link>
      </div>
    </section>
  )
}
