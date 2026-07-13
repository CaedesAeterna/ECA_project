import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

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
      ? 'text-brand underline decoration-2'
      : 'text-ink hover:text-brand hover:underline')

  // Active-aware class for the stacked mobile menu links.
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    'block rounded-lg px-3 py-2.5 font-display font-semibold transition-colors ' +
    (isActive ? 'bg-blush text-brand' : 'text-ink hover:bg-blush')

  return (
    <>
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo / wordmark */}
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand font-display text-lg font-extrabold text-white">
              E
            </span>
            <span className="font-display text-xl font-extrabold text-brand">ECA</span>
          </NavLink>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={linkClass}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              {t('nav.about')}
            </NavLink>
          </div>

          {/* Language selector + call-to-action + mobile toggle */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <NavLink
              to="/contact"
              className="hidden rounded-full border-2 border-brand px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white md:inline-block"
            >
              {t('nav.contact')}
            </NavLink>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-blush md:hidden"
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
          <div className="border-t border-slate-100 md:hidden">
            <div className="mx-auto max-w-6xl space-y-1 px-6 py-4">
              <NavLink to="/" end className={mobileLinkClass}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/about" className={mobileLinkClass}>
                {t('nav.about')}
              </NavLink>
              <NavLink
                to="/contact"
                className="mt-2 block rounded-full bg-brand px-3 py-2.5 text-center font-display font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
              >
                {t('nav.contact')}
              </NavLink>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <Outlet />
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted">
          © {new Date().getFullYear()} ECA — {t('footer.rights')}
        </div>
      </footer>
    </>
  )
}
