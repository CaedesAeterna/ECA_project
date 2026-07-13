import { useId } from 'react'

type FlagProps = {
  code: string
  className?: string
}

// Inline SVG flags. Emoji flags (🇬🇧) don't render on many Linux setups (they
// fall back to "GB"/"HU"/"RO" letters), so we draw them as SVG for a consistent
// look everywhere and zero external requests.
export default function Flag({ code, className }: FlagProps) {
  // Unique ids so the UK flag's clip paths don't collide when rendered twice
  // (once in the trigger button, once in the dropdown list).
  const id = useId()

  switch (code) {
    case 'en':
      return (
        <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
          <clipPath id={`${id}-a`}>
            <path d="M0 0v30h60V0z" />
          </clipPath>
          <clipPath id={`${id}-b`}>
            <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
          </clipPath>
          <g clipPath={`url(#${id}-a)`}>
            <path d="M0 0v30h60V0z" fill="#012169" />
            <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
            <path
              d="M0 0l60 30m0-30L0 30"
              clipPath={`url(#${id}-b)`}
              stroke="#c8102e"
              strokeWidth="4"
            />
            <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
            <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
          </g>
        </svg>
      )
    case 'hu':
      return (
        <svg viewBox="0 0 6 3" className={className} aria-hidden="true">
          <rect width="6" height="3" fill="#fff" />
          <rect width="6" height="1" fill="#ce2939" />
          <rect width="6" height="1" y="2" fill="#477050" />
        </svg>
      )
    case 'ro':
      return (
        <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
          <rect width="3" height="2" fill="#002b7f" />
          <rect width="2" height="2" x="1" fill="#fcd116" />
          <rect width="1" height="2" x="2" fill="#ce1126" />
        </svg>
      )
    case 'pl':
      return (
        <svg viewBox="0 0 8 5" className={className} aria-hidden="true">
          <rect width="8" height="5" fill="#fff" />
          <rect width="8" height="2.5" y="2.5" fill="#dc143c" />
        </svg>
      )
    default:
      return null
  }
}
