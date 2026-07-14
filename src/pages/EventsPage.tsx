import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Gallery from '../components/Gallery'
import { eventsByCountry, type Block, type EventEntry } from '../data/events'

// Event photos, grouped by country + event folder (matching EventEntry.folder).
// Full-resolution originals live in assets/gallery/events/<country>/<folder>/;
// drop images into the right folder and they attach to that event automatically.
const imageModules = import.meta.glob(
  '../assets/gallery/events/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}',
  { eager: true, import: 'default' },
) as Record<string, string>

const EV_PREFIX = '../assets/gallery/events/'
const imagesByEvent: Record<string, Record<string, string[]>> = {}
for (const path of Object.keys(imageModules).sort()) {
  const segments = path.slice(EV_PREFIX.length).split('/')
  if (segments.length < 3) continue // <country>/<folder>/<file>
  const [country, folder] = segments
  const byFolder = (imagesByEvent[country] ??= {})
  ;(byFolder[folder] ??= []).push(imageModules[path])
}

// Country sections, in display order.
const COUNTRIES = ['hu', 'pl'] as const
type Country = (typeof COUNTRIES)[number]

// Bold the leading term of a "Term – explanation" bullet (Emotion/Cognition/Action).
function ListItem({ text }: { text: string }) {
  const [term, ...rest] = text.split(' – ')
  if (rest.length === 0) return <>{text}</>
  return (
    <>
      <span className="font-semibold text-ink">{term}</span> – {rest.join(' – ')}
    </>
  )
}

// Render one content block (paragraph / lead / heading / bullet list / signature).
function renderBlock(block: Block, i: number) {
  if (typeof block === 'string') {
    return (
      <p key={i} className="leading-relaxed text-ink">
        {block}
      </p>
    )
  }
  if ('lead' in block) {
    return (
      <p key={i} className="text-lg leading-relaxed text-muted">
        {block.lead}
      </p>
    )
  }
  if ('h' in block) {
    return (
      <h4 key={i} className="pt-2 font-display text-lg font-bold tracking-tight text-ink">
        {block.h}
      </h4>
    )
  }
  if ('sig' in block) {
    return (
      <p key={i} className="pt-2 text-sm italic text-muted">
        {block.sig}
      </p>
    )
  }
  return (
    <ul key={i} className="space-y-2 text-ink">
      {block.list.map((item, j) => (
        <li key={j} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span className="leading-relaxed">
            <ListItem text={item} />
          </span>
        </li>
      ))}
    </ul>
  )
}

// Chevron indicator for the disclosure summaries.
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

// One event as a nested disclosure: date · title in the summary, report + gallery inside.
function EventPanel({
  event,
  bodyLang,
  images,
  galleryLabels,
  galleryAlt,
}: {
  event: EventEntry
  bodyLang: 'hu' | 'en'
  images: string[]
  galleryLabels: { close: string; prev: string; next: string }
  galleryAlt: string
}) {
  const title = event.title[bodyLang]
  const blocks = event.body[bodyLang]
  return (
    <details className="group/event rounded-xl border border-ink/10 bg-white px-4 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
        <time className="shrink-0 font-mono text-xs text-muted">{event.date}</time>
        <span className="font-display font-bold text-ink">{title}</span>
        <Chevron className="ml-auto h-4 w-4 shrink-0 text-muted transition-transform group-open/event:rotate-180" />
      </summary>
      <div className="border-t border-ink/10 py-4">
        <div className="space-y-4">{blocks.map(renderBlock)}</div>
        {images.length > 0 && (
          <div className="mt-6">
            <Gallery
              images={images.map((src, i) => ({ src, alt: `${title} — ${galleryAlt} ${i + 1}` }))}
              labels={galleryLabels}
            />
          </div>
        )}
      </div>
    </details>
  )
}

// A country section: a big disclosure containing its events (or an empty note).
function CountrySection({ country, defaultOpen }: { country: Country; defaultOpen?: boolean }) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2)
  const bodyLang: 'hu' | 'en' = lang === 'hu' ? 'hu' : 'en'
  const events = eventsByCountry[country]
  const galleryLabels = {
    close: t('events.gallery.close'),
    prev: t('events.gallery.prev'),
    next: t('events.gallery.next'),
  }
  const galleryAlt = t('events.gallery.alt')

  return (
    <details
      open={defaultOpen}
      className="group/country overflow-hidden rounded-2xl border border-ink/10 bg-blush/40 open:bg-blush/60"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-6 py-5 [&::-webkit-details-marker]:hidden">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {t(`events.countries.${country}`)}
        </h2>
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-sm font-semibold text-brand">
          {events.length}
        </span>
        <Chevron className="ml-auto h-6 w-6 shrink-0 text-muted transition-transform group-open/country:rotate-180" />
      </summary>
      <div className="px-4 pb-5 sm:px-6">
        {events.length === 0 ? (
          <p className="py-4 text-muted">{t('events.empty')}</p>
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => (
              <EventPanel
                key={i}
                event={event}
                bodyLang={bodyLang}
                images={imagesByEvent[country]?.[event.folder] ?? []}
                galleryLabels={galleryLabels}
                galleryAlt={galleryAlt}
              />
            ))}
          </div>
        )}
      </div>
    </details>
  )
}

export default function EventsPage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t('events.title')}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-muted">
        {t('events.intro')}
      </p>

      <div className="mt-10 space-y-4">
        {COUNTRIES.map((country, i) => (
          <CountrySection key={country} country={country} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Bottom button: the 3-letter wordmark, back to the home page. */}
      <div className="mt-14 flex justify-center">
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
