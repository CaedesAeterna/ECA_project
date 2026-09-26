import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import erasmusLogo from '../assets/erasmus-logo.jpg'
import meseligetLogo from '../assets/meseliget-logo.png'
import gedaniaLogo from '../assets/gedania-1922-logo.png'

// Meseliget foundation name, reused as the logo's alt text (language-neutral).
const FOUNDATION_NAME = 'Meseliget Alapítvány'

// The funding + partner logos on the white strip. Give an entry an `href` and it
// renders as a link that opens in a new tab; without one it stays a plain image,
// so linking a logo is opt-in and the rest are unaffected.
//
// TO ADD THE NEXT PARTNER LOGO (3 steps):
//   1. drop the image in src/assets/  (SVG or transparent PNG works best)
//   2. import it at the top of this file
//   3. add an entry below, e.g.
//        { src: newPartnerLogo, alt: 'Partner name', href: 'https://example.org/', size: 'h-14 sm:h-16' },
type PartnerLogo = {
  src: string
  alt: string
  /** When set, the logo becomes a link to this address. */
  href?: string
  /** Tailwind height classes — logos are optically balanced, not uniform. */
  size: string
}

const PARTNER_LOGOS: PartnerLogo[] = [
  {
    src: erasmusLogo,
    alt: 'Co-funded by the Erasmus+ programme of the European Union',
    size: 'h-12 sm:h-14',
  },
  { src: meseligetLogo, alt: FOUNDATION_NAME, size: 'h-14 sm:h-16' },
  { src: gedaniaLogo, alt: 'Gedania 1922', size: 'h-16 sm:h-20' },
]

// One logo — wrapped in a link when the entry carries an `href`.
function PartnerLogoItem({ logo }: { logo: PartnerLogo }) {
  const image = <img src={logo.src} alt={logo.alt} className={`${logo.size} w-auto`} />
  if (!logo.href) return image
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      title={logo.alt}
      className="rounded-lg transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      {image}
    </a>
  )
}

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
          {PARTNER_LOGOS.map((logo) => (
            <PartnerLogoItem key={logo.alt} logo={logo} />
          ))}
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
    </section>
  )
}
