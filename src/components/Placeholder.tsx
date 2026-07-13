import { useTranslation } from 'react-i18next'

type PlaceholderProps = {
  // Locale namespace holding `${ns}.title` and `${ns}.body`.
  ns: string
}

// Minimal placeholder section shared by the nav pages until real content lands.
export default function Placeholder({ ns }: PlaceholderProps) {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t(`${ns}.title`)}
      </h1>
      <p className="mt-4 text-lg text-muted">{t(`${ns}.body`)}</p>
    </section>
  )
}
