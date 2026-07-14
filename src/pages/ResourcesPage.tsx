import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import meseligetLogo from '../assets/meseliget-logo.png'

// Implementing foundation — language-neutral, so kept out of the locale files.
const FOUNDATION_URL = 'https://www.meseligetalapitvany.hu'
const FOUNDATION_NAME = 'Meseliget Alapítvány'

// The teacher handbook is a single (Hungarian) pilot PDF, so the URL is
// language-neutral; only its label is translated in the locale files.
const HANDBOOK_URL =
  'https://ecaproject.eu/wp-content/uploads/2026/06/ECA_tanari_kezikonyv_kulso_pilot.pdf'

export default function ResourcesPage() {
  const { t } = useTranslation()

  // Body copy and the two feature cards are stored in the locale files.
  const paragraphs = t('resources.paragraphs', { returnObjects: true }) as string[]
  const items = t('resources.items', { returnObjects: true }) as {
    title: string
    body: string
  }[]

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

      {/* Prominent download of the teacher handbook (external PDF, new tab). */}
      <a
        href={HANDBOOK_URL}
        target="_blank"
        rel="noreferrer"
        className="group mt-10 flex items-center gap-4 rounded-2xl border-2 border-brand bg-brand/5 px-6 py-5 text-ink transition-colors hover:bg-brand hover:text-white"
      >
        {/* Document icon. */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-9 w-9 shrink-0 text-brand group-hover:text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 3v5h5" />
          <path d="M15 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
        </svg>
        <span className="flex flex-col">
          <span className="font-display text-lg font-extrabold tracking-tight">
            {t('resources.handbook')}
          </span>
          <span className="text-sm text-muted group-hover:text-white/80">
            {t('resources.download')}
          </span>
        </span>
        {/* Download arrow, pushed to the right edge. */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="ml-auto h-6 w-6 shrink-0"
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
      </a>

      {/* Bottom button: the 3-letter wordmark, back to the home page. */}
      <div className="mt-12 flex justify-center">
        <Link
          to="/"
          className="rounded-full border-2 border-brand px-6 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {t('brand')}
        </Link>
      </div>

      {/* Implementing foundation, shown near the foot of the page. */}
      <div className="mt-16 flex flex-col items-center gap-3 border-t border-ink/10 pt-10">
        <a href={FOUNDATION_URL} target="_blank" rel="noreferrer" aria-label={FOUNDATION_NAME}>
          <img src={meseligetLogo} alt={FOUNDATION_NAME} className="h-16 w-auto sm:h-20" />
        </a>
        <a
          href={FOUNDATION_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
        >
          www.meseligetalapitvany.hu
        </a>
      </div>
    </section>
  )
}
