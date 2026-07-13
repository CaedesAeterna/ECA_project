# ECA

Multilingual presentation site (placeholder). Static build, deployable to any
static host for free.

## Tech stack

- **Vite** + **React 19** + **TypeScript** — builds to static HTML/JS/CSS (`dist/`)
- **react-router-dom** (`HashRouter`) — client-side pages, no server needed
- **i18next** + **react-i18next** — languages: `en`, `hu`, `ro`
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- Package manager: **Yarn 4** (via Corepack)

## Develop

```bash
corepack enable      # once per machine — activates Yarn 4 from package.json
yarn install
yarn dev             # http://localhost:5173
```

## Build

```bash
yarn build           # -> dist/ (static files)
yarn preview         # serve the built dist/ locally
```

## Languages

- Translations live in `src/i18n/locales/{en,hu,ro}.ts` — keep the same shape in each.
- Registered in `src/i18n/index.ts`; the switcher set is in `src/components/LanguageSwitcher.tsx`.
- Default/fallback language is `en` (change `fallbackLng` / initial `lng` in `src/i18n/index.ts`).
- Romanian is tentative — to drop it, delete `ro.ts` and its references in those two files.

## Publish for free

The build is fully static, so any of these work:

- **Netlify Drop (fastest, no account/git):** run `yarn build`, then drag the
  `dist/` folder onto <https://app.netlify.com/drop>. Instant public URL.
- **GitHub Pages (auto-deploy on push):** push this repo to GitHub, then
  Settings -> Pages -> Source = "GitHub Actions". The included
  `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
- **Cloudflare Pages / Netlify (git-connected):** connect the repo, set build
  command `yarn build` and output directory `dist`.

`HashRouter` (URLs like `/#/about`) means routing works on all of the above with
zero redirect config. To get clean URLs (`/about`) later, switch to
`BrowserRouter` and add an SPA fallback (`404.html` on GitHub Pages, or a
`_redirects` file with `/* /index.html 200` on Netlify/Cloudflare).
