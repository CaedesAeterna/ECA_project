import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import erasmusLogo from '../assets/erasmus-logo.jpg'
import meseligetLogo from '../assets/meseliget-logo.png'
import gedaniaLogo from '../assets/gedania-1922-logo.png'

// Meseliget foundation (language-neutral).
const FOUNDATION_URL = 'https://www.meseligetalapitvany.hu'
const FOUNDATION_NAME = 'Meseliget Alapítvány'

export default function PartnersPage() {
  const { t } = useTranslation()

  // Body copy is stored as an array of paragraphs in the locale files.
  const paragraphs = t('partners.paragraphs', { returnObjects: true }) as string[]

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t('partners.title')}
      </h1>

      {/* Funding + partner logos on a white strip, right after the title, so the
          opaque Erasmus JPG blends in; transparent PNGs sit fine on white too. */}
      <div className="mt-8 rounded-2xl bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          <img
            src={erasmusLogo}
            alt="Co-funded by the Erasmus+ programme of the European Union"
            className="h-12 w-auto sm:h-14"
          />
          <img src={meseligetLogo} alt={FOUNDATION_NAME} className="h-14 w-auto sm:h-16" />
          <img src={gedaniaLogo} alt="Gedania 1922" className="h-16 w-auto sm:h-20" />
        </div>
      </div>

      <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink">
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

      {/* Foundation credit at the very foot — same block as the project page. */}
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
