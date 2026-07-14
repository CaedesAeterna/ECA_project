import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Gallery from '../components/Gallery'
import meseligetLogo from '../assets/meseliget-logo.png'
import jaszberenyPhoto from '../assets/ECA-Jaszbereny-768x576.jpg'

// Implementing foundation — language-neutral, so kept out of the locale files.
const FOUNDATION_URL = 'https://www.meseligetalapitvany.hu'
const FOUNDATION_NAME = 'Meseliget Alapítvány'

// Workshop photos: drop image files into src/assets/gallery/experience/ and they
// are picked up automatically at build time, sorted by filename. See that
// folder's README for the naming convention.
const galleryModules = import.meta.glob('../assets/gallery/experience/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const galleryImages = Object.keys(galleryModules)
  .sort()
  .map((path) => galleryModules[path])

type Section = {
  heading: string
  paragraphs: string[]
  list?: string[]
  after?: string[]
}

// Emphasise the leading term of "Term – explanation" list items (used by the
// Emotion/Cognition/Action list). Items without the " – " separator render as-is.
function ListItem({ text }: { text: string }) {
  const [term, ...rest] = text.split(' – ')
  if (rest.length === 0) return <>{text}</>
  return (
    <>
      <span className="font-semibold text-ink">{term}</span> – {rest.join(' – ')}
    </>
  )
}

export default function ExperiencePage() {
  const { t } = useTranslation()

  const lead = t('experience.lead', { returnObjects: true }) as string[]
  const sections = t('experience.sections', { returnObjects: true }) as Section[]

  return (
    <article className="mx-auto max-w-3xl">
      {/* Eyebrow = section/nav label; the article headline below is the real title. */}
      <p className="text-center font-display text-sm font-bold uppercase tracking-widest text-brand">
        {t('experience.title')}
      </p>
      <h1 className="mt-3 text-center font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
        {t('experience.headline')}
      </h1>

      {/* Lead — set larger and lighter than the body. */}
      <div className="mt-8 space-y-4 text-xl leading-relaxed text-muted">
        {lead.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Hero photo; the caption text now serves as its description. */}
      <figure className="mt-10">
        <img
          src={jaszberenyPhoto}
          alt={t('experience.caption')}
          className="w-full rounded-2xl shadow-sm"
        />
        <figcaption className="mt-3 text-center text-sm italic text-muted">
          {t('experience.caption')}
        </figcaption>
      </figure>

      {/* Article body. */}
      <div className="mt-12 space-y-10">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink">
              {section.paragraphs.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </div>
            {section.list && (
              <ul className="mt-4 space-y-2.5 text-lg leading-relaxed text-ink">
                {section.list.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    <span>
                      <ListItem text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {section.after && (
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink">
                {section.after.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Workshop gallery — square thumbnail grid + self-built lightbox. Renders
          only when photos exist in src/assets/gallery/experience/. */}
      {galleryImages.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {t('experience.gallery.title')}
          </h2>
          <div className="mt-6">
            <Gallery
              images={galleryImages.map((src, i) => ({
                src,
                alt: `${t('experience.gallery.alt')} ${i + 1}`,
              }))}
              labels={{
                close: t('experience.gallery.close'),
                prev: t('experience.gallery.prev'),
                next: t('experience.gallery.next'),
              }}
            />
          </div>
        </section>
      )}

      {/* Bottom button: the 3-letter wordmark, back to the home page. */}
      <div className="mt-14 flex justify-center">
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
    </article>
  )
}
