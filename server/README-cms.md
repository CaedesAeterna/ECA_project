# ECA CMS (flat-file, no database)

A single auth-protected PHP endpoint that manages the site's content — resource
PDFs, event galleries, event report texts and the **page background colour** — by
editing files on disk and `media/manifest.json`. There is **no database**: the manifest *is* the database,
and there is **one admin user** whose bcrypt hash lives in a config file.

The React site fetches `media/manifest.json` at runtime, so content changes made
in the CMS appear on the next page load, **without rebuilding or redeploying** the
app.

```
docroot (/home/<account>/ecaproject.eu)
├── index.html, assets/…        ← the React app (deployed by GitHub Actions, dist only)
├── cms.php                     ← THE CMS (open this in a browser)
├── cms_lib.php                 ← helpers used by cms.php
├── config.sample.php           ← template (real config is created by setup)
└── media/                      ← CMS-owned; NOT part of the app build
    ├── .htaccess               ← blocks script execution here
    ├── manifest.json           ← the content index
    ├── resources/<cat>/<lang>/…pdf
    └── gallery/events/<country>/<id>/…jpg
```

## Requirements
- PHP **7.4 – 8.3** (verified on both ends). 7.4 is the floor — the code uses arrow
  functions, `??=` and the array form of `session_set_cookie_params`. No database
  or `mysqli` needed. Set the domain's version in cPanel → *MultiPHP Manager*.
- The `fileinfo` extension (on by default) — used to MIME-check uploads.

## Deployment — all from the repo (no manual FTP)
Everything ships through GitHub Actions; you never drag files by hand.

1. **Push to `main`.** `deploy-cpanel.yml` builds the app **and** bundles
   `cms.php` + `cms_lib.php` into the same FTPS upload, so the CMS endpoint lands
   at `https://ecaproject.eu/cms.php` automatically.
2. **Seed the media once.** In the repo's **Actions** tab, run the
   **“Seed CMS media”** workflow (`seed-media.yml`, manual *Run workflow*). It
   uploads `server/media/` (the initial PDFs, galleries and `manifest.json`) to
   `<docroot>/media/`. Do this right after the first push — until it runs, the
   Resources/Events pages have nothing to fetch and show empty.
3. **Create the admin.** Open `https://ecaproject.eu/cms.php`; the first visit
   shows a **setup** page — pick a username + password (do it immediately; setup
   self-disables once the config exists). Setup writes the admin config to
   `eca-cms-config.php` *above* the web root when possible (not web-accessible),
   else `config.php` next to `cms.php`; if it can’t write either it prints the
   file for you to paste.

From then on: **content is edited in the CMS** (never re-run the seed), and
**code/app changes deploy by pushing** to `main`.

## Using it
- **Resources**: per category (Handbook, Curriculum, Lesson plans, Worksheets,
  Homework, Question collection) and language, upload/delete PDFs and rename their
  titles. "Lesson plans" also has an optional *Group* field (keeps a project's
  parts together, e.g. the "Paradicsom" series).
- **Events**: per country (Hungary/Poland) add/edit/delete events. Each event has
  a date, HU + EN titles, HU + EN report text, and a photo gallery.
- **Report text markers** (in the report text boxes):
  - `## Heading`
  - `- bullet` (consecutive lines become one list)
  - `* lead paragraph` (rendered larger/muted, good for the intro)
  - `-- signature`
  - a blank line starts a new paragraph.

- **Appearance — background colour**: a full colour picker with a **live preview**
  of the real page. Set it by hex, the native picker, **RGB or HSL sliders**, one
  of 12 **presets**, or the screen eyedropper (Chrome). *Undo changes* returns to
  the saved colour, *Reset to the default* to the built-in blush. It applies to
  the whole site on the visitor's next page load — no rebuild, no redeploy.

## How the background colour works
Tailwind emits each design token as a CSS custom property on `:root`
(`--color-blush`), and the utilities use `var(--color-blush)` — so the site sets
that single property on the root element at runtime and the page background (and
every `bg-blush` band) repaints at once.

- **The CMS is the only place the colour is set.** `src/lib/theme.ts` just applies
  whatever the manifest says (`applyManifestTheme`); the CMS writes
  `theme.background` (`"#rrggbb"`, or `null` for the built-in default).
- To avoid a colour flash, the last applied colour is cached in `localStorage`
  and painted by a tiny inline script in `index.html` before first paint; the
  manifest is authoritative and overrides it a moment later. Saving `null`
  (*Reset to the default*) also clears that cache for visitors.

## How this coexists with the app deploy
The push workflow uploads `dist/` **plus `cms.php`/`cms_lib.php`**, and tracks
only its own files (`.ftp-deploy-sync-state.json`), so it **never touches
`media/`** — your CMS uploads and edited `manifest.json` survive every redeploy.
The media seed is a separate manual workflow with its own state file, so the two
never conflict. Changing the CMS code = just push; content = edit in the CMS.

## Content backup: CMS uploads flow back into the repo
`sync-content.yml` mirrors the server's `media/` **back into the repo** so every
file uploaded/edited in the CMS becomes a versioned git commit (a backup + history
— the live site still serves from the server, not from the repo). It runs
roughly every 10 minutes (only committing when something actually changed) and on
demand via **Actions → “Sync content from server” → Run workflow**.

It is **tokenless on the host**: the commit is made by the workflow's built-in
`GITHUB_TOKEN`, and it reuses the existing FTP secrets to pull. If the server has
no `manifest.json` yet (media not seeded), it safely skips — an empty remote can
never wipe the repo. Content-only commits are ignored by `deploy-cpanel.yml`
(`paths-ignore: server/media/**`), so they don't redeploy the app.

## Security notes
- HTTPS only (the cert on ecaproject.eu is valid); session cookie is HttpOnly +
  Secure + SameSite. All mutations are CSRF-protected.
- Uploads are restricted by extension **and** sniffed content type; filenames are
  slugged to ASCII. `media/.htaccess` blocks execution of anything script-like.
- The admin password is stored only as a bcrypt hash. Keep `eca-cms-config.php`
  outside the web root if your host allows it (setup tries this first).

## Local development
`server/media/` is committed as the seed and is served at `/media` by a Vite dev
middleware (see `vite.config.ts`). The committed copy is just the starting point;
in production the CMS owns the live `media/` on the host.
