import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryImage = {
  src: string
  alt: string
}

type GalleryProps = {
  images: GalleryImage[]
  // Localised labels for the lightbox controls.
  labels: {
    close: string
    prev: string
    next: string
  }
}

// Square-thumbnail grid with a self-built, dependency-free lightbox.
export default function Gallery({ images, labels }: GalleryProps) {
  // null = lightbox closed; otherwise the index of the currently open image.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  )
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  )

  const isOpen = openIndex !== null

  // While the lightbox is open: keyboard controls, body scroll lock, initial focus.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, close, next, prev])

  if (images.length === 0) return null

  return (
    <>
      {/* Thumbnail grid — uniform squares, cropped via object-cover. */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={image.alt}
              className="group block w-full overflow-hidden rounded-xl bg-blush focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox overlay — click the backdrop or press Esc to close. */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[openIndex].alt}
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(dx) > 50) {
              if (dx < 0) next()
              else prev()
            }
            touchStartX.current = null
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          {/* Close button. */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label={labels.prev}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 sm:left-4"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          )}

          {/* stopPropagation so clicking the image itself doesn't close. */}
          <img
            src={images[openIndex].src}
            alt={images[openIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label={labels.next}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 sm:right-4"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
