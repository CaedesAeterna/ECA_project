import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import FoundationCredit from './FoundationCredit'
import ecaLogo from '../assets/eca-logo.png'

// Top-level navigation, shared by the desktop header and the mobile menu.
const NAV = [
  { to: '/project', key: 'nav.project' },
  { to: '/partners', key: 'nav.partners' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/events', key: 'nav.events' },
] as const

// Shared chrome (header + footer) rendered around every page via <Outlet />.
export default function Layout() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Active-aware class for the desktop nav links (react-router NavLink).
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    'font-display text-sm font-semibold underline-offset-8 transition-colors ' +
    (isActive
      ? 'text-ink underline decoration-2'
      : 'text-muted hover:text-ink hover:underline')

  // Active-aware class for the stacked mobile menu links.
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    'block py-2 font-display text-base font-semibold transition-colors ' +
    (isActive ? 'text-ink underline underline-offset-4' : 'text-muted hover:text-ink')

  return (
    <>
      {/* Seamless header over the page background with just a hairline divider. */}
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-blush/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          {/* Wordmark — program logo + localized acronym, links back to home.
              The logo is a transparent PNG, so it blends on the warm header. */}
          <NavLink to="/" className="flex items-center gap-2.5">
            <img src={ecaLogo} alt="" aria-hidden="true" className="h-9 w-auto sm:h-10" />
            <span className="font-display text-xl font-extrabold uppercase tracking-tight text-ink underline underline-offset-4">
              {t('brand')}
            </span>
          </NavLink>

          {/* Desktop navigation + language selector */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV.map(({ to, key }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {t(key)}
              </NavLink>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile: language selector + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-black/5"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="border-t border-ink/10 md:hidden">
            <div className="mx-auto max-w-6xl px-6 py-3">
              {NAV.map(({ to, key }) => (
                <NavLink key={to} to={to} className={mobileLinkClass}>
                  {t(key)}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <Outlet />
      </main>

      {/* Footer: the hairline (border-t) is the divider above the foundation
          credit, then the copyright line. Shown on every page via the layout. */}
      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-12 text-center">
          <FoundationCredit />
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {t('brand')} — {t('footer.rights')}
          </p>
        </div>
      </footer>
    </>
  )
}
