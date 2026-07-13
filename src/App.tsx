import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// HashRouter keeps routing entirely client-side (URLs look like `/#/about`), so
// the static build works on any host — GitHub Pages, Netlify, Cloudflare Pages —
// with no server-side redirect/rewrite configuration.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Shared layout (header + footer) wraps every page via <Outlet />. */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Unknown paths fall back to the home page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
