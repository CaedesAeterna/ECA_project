import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import PartnersPage from './pages/PartnersPage'
import ResourcesPage from './pages/ResourcesPage'
import ExperiencePage from './pages/ExperiencePage'

// HashRouter keeps routing entirely client-side (URLs look like `/#/project`), so
// the static build works on any host — GitHub Pages, Netlify, Cloudflare Pages —
// with no server-side redirect/rewrite configuration.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Shared layout (header + footer) wraps every page via <Outlet />. */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          {/* Unknown paths fall back to the home page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
