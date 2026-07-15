import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeroIllustration from '../components/HeroIllustration'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-5xl">
      {/* Cover art — minimalist scene of children learning together outdoors. */}
      <div className="overflow-hidden rounded-3xl ring-1 ring-ink/5 shadow-sm">
        <HeroIllustration className="block h-auto w-full" label={t('home.coverAlt')} />
      </div>

      {/* Hero — brand wordmark, its spelled-out expansion, a tagline and the CTA. */}
      <div className="mx-auto flex max-w-3xl flex-col items-center pt-10 text-center sm:pt-12">
        <h1 className="font-display text-7xl font-extrabold uppercase tracking-tight text-brand sm:text-8xl">
          {t('brand')}
        </h1>
        <p className="mt-5 font-display text-xl font-semibold tracking-wide text-ink sm:text-2xl">
          {t('home.expansion')}
        </p>
        <p className="mt-6 text-lg text-muted sm:text-xl">{t('home.tagline')}</p>
        <Link
          to="/project"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 font-display text-lg font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          {t('home.cta')}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
