import { useTranslation } from 'react-i18next'
import ecaLogo from '../assets/eca-logo.png'
import meseligetLogo from '../assets/meseliget-logo.png'

// Implementing foundation — language-neutral, so kept out of the locale files.
const FOUNDATION_URL = 'https://www.meseligetalapitvany.hu'
const FOUNDATION_NAME = 'Meseliget Alapítvány'

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
