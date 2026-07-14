# Workshop gallery

Drop image files here (`.jpg`, `.jpeg`, `.png`, `.webp`) and they appear
automatically in the Experience page gallery — no code changes needed. Vite
picks them up at build time via `import.meta.glob`, content-hashes them, and
rewrites the URLs correctly for the subpath deploy.

- Files are shown **sorted by filename**, so use a numeric prefix to control
  order, e.g. `01-opening.jpg`, `02-groupwork.jpg`, `03-closing.jpg`.
- The grid shows **square thumbnails** (cropped with `object-cover`); the
  lightbox shows the full, uncropped image.
- The `sample-*.jpg` files are placeholders. Delete them once you add real
  photos:

  ```sh
  rm sample-*.jpg
  ```
