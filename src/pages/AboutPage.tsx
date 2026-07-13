import { useTranslation } from 'react-i18next'

export default function AboutPage() {
  const { t } = useTranslation()

  // Bullet points are stored as an array in the locale files.
  const points = t('about.points', { returnObjects: true }) as string[]

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-brand/20 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          {t('about.title')}
        </h1>
        <p className="mt-4 text-muted">{t('about.body')}</p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-ink">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
