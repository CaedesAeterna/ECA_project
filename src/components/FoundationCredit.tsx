import meseligetLogo from '../assets/meseliget-logo.png'

// Implementing-foundation credit: the Meseliget logo + link. Language-neutral,
// so no i18n. Rendered once in the global footer (Layout), above the copyright.
const FOUNDATION_URL = 'https://www.meseligetalapitvany.hu'
const FOUNDATION_NAME = 'Meseliget Alapítvány'

export default function FoundationCredit() {
  return (
    <div className="flex flex-col items-center gap-3">
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
  )
}
