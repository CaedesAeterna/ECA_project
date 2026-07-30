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

## One-time deployment
1. Upload the **contents of this `server/` folder** to the site's document root
   (`/home/<account>/ecaproject.eu`) so you end up with `cms.php`, `cms_lib.php`
   and `media/` sitting next to `index.html`. FileZilla drag-and-drop is fine.
   - ⚠️ Upload `media/` **before** (or together with) the next app deploy —
     otherwise the Resources/Events pages have nothing to fetch and show empty.
2. Open `https://ecaproject.eu/cms.php` in a browser. On first visit it shows a
   **setup** page — pick a username + password. Do this **immediately** after
   upload (setup self-disables once the config exists).
   - Setup writes the admin config to `eca-cms-config.php` in the folder *above*
     the web root when possible (not web-accessible); otherwise to `config.php`
     next to `cms.php`. If it can't write either, it prints the file for you to
     create by hand.
3. Log in and manage content. Done.

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
The GitHub Actions workflow uploads **only `dist/`** and tracks only its own
files, so it never touches `cms.php` or `media/`. Deploying the app and editing
content are fully independent. To change the CMS code later, re-upload `cms.php`
/ `cms_lib.php` manually.

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
