import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import erasmusLogo from '../assets/erasmus-logo.jpg'
import meseligetLogo from '../assets/meseliget-logo.png'
import gedaniaLogo from '../assets/gedania-1922-logo.png'

// Meseliget foundation site (language-neutral).
const FOUNDATION_URL = 'https://www.meseligetalapitvany.hu'

export default function PartnersPage() {
  const { t } = useTranslation()

  // Body copy is stored as an array of paragraphs in the locale files.
  const paragraphs = t('partners.paragraphs', { returnObjects: true }) as string[]

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t('partners.title')}
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Playful cross-links: the wordmark -> home, plus a nod back to the project page. */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <Link
          to="/"
          className="font-display font-extrabold uppercase tracking-wide text-brand underline underline-offset-4 hover:text-brand-dark"
        >
          {t('brand')}
        </Link>
        <Link to="/project" className="text-muted underline underline-offset-4 hover:text-ink">
          ← {t('nav.project')}
        </Link>
      </div>

      {/* Funding + partner logos on a white strip so the opaque Erasmus JPG blends in. */}
      <div className="mt-10 rounded-2xl bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          <img
            src={erasmusLogo}
            alt="Co-funded by the Erasmus+ programme of the European Union"
            className="h-12 w-auto sm:h-14"
          />
          <a
            href={FOUNDATION_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Meseliget Alapítvány"
          >
            <img src={meseligetLogo} alt="Meseliget Alapítvány" className="h-14 w-auto sm:h-16" />
          </a>
          <img src={gedaniaLogo} alt="Gedania 1922" className="h-16 w-auto sm:h-20" />
        </div>
        <p className="mt-5 text-center text-sm">
          <a
            href={FOUNDATION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
          >
            www.meseligetalapitvany.hu
          </a>
        </p>
      </div>
    </section>
  )
}
