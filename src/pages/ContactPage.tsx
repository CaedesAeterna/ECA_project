import { useTranslation } from 'react-i18next'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-brand/40 bg-panel p-8 shadow-sm sm:p-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          {t('contact.title')}
        </h1>
        <p className="mt-4 text-ink">{t('contact.body')}</p>
        <a
          href="mailto:hello@example.com"
          className="mt-6 inline-block font-bold text-brand underline underline-offset-4 hover:text-brand-dark"
        >
          {t('contact.email')}
        </a>
      </div>
    </section>
  )
}
