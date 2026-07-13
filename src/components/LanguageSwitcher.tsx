import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Flag from './Flag'

// UI languages shown in the switcher. Add/remove an entry to change the set
// (must match the resources registered in src/i18n/index.ts).
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hu', label: 'Magyar' },
  { code: 'ro', label: 'Română' },
  { code: 'pl', label: 'Polski' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current =
    LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0]

  // Close the dropdown on an outside click or the Escape key.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.label}
        className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 transition-colors hover:border-brand"
      >
        <Flag code={current.code} className="h-4 w-6 rounded-sm ring-1 ring-black/10" />
        <svg
          className={'h-3 w-3 text-muted transition-transform ' + (open ? 'rotate-180' : '')}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {LANGUAGES.map(({ code, label }) => {
            const active = code === current.code
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => select(code)}
                  className={
                    'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ' +
                    (active ? 'font-semibold text-brand' : 'text-ink hover:bg-blush')
                  }
                >
                  <Flag code={code} className="h-4 w-6 rounded-sm ring-1 ring-black/10" />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
