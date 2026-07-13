import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-brand/15 bg-white p-10 text-center shadow-sm sm:p-16">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          {t('home.subtitle')}
        </p>
        <Link
          to="/project"
          className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-display font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          {t('home.cta')}
        </Link>
      </div>
    </section>
  )
}
