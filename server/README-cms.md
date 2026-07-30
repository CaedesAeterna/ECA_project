# ECA CMS (flat-file, no database)

A single auth-protected PHP endpoint that manages the site's content — resource
PDFs, event galleries and event report texts — by editing files on disk and
`media/manifest.json`. There is **no database**: the manifest *is* the database,
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
- PHP **8.0+** (cPanel → *MultiPHP Manager* if you need to bump the domain).
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

## How this coexists with the app deploy
The push workflow uploads `dist/` **plus `cms.php`/`cms_lib.php`**, and tracks
only its own files (`.ftp-deploy-sync-state.json`), so it **never touches
`media/`** — your CMS uploads and edited `manifest.json` survive every redeploy.
The media seed is a separate manual workflow with its own state file, so the two
never conflict. Changing the CMS code = just push; content = edit in the CMS.

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
