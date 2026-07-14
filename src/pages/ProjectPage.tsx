import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ecaLogo from '../assets/eca-logo.png'

export default function ProjectPage() {
  const { t } = useTranslation()

  // Body copy is stored as an array of paragraphs in the locale files.
  const paragraphs = t('project.paragraphs', { returnObjects: true }) as string[]

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t('project.title')}
      </h1>

      {/* Large program logo — replace src/assets/eca-logo.svg with the real file. */}
      <img src={ecaLogo} alt={t('project.title')} className="mx-auto my-10 h-32 w-auto sm:h-44" />

      <div className="space-y-5 text-lg leading-relaxed text-ink">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

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
