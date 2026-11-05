import { useTranslation } from 'react-i18next'

export default function FundingDisclaimer() {
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage ?? 'en').slice(0, 2)
  const textLanguage = language === 'hu' ? 'hu' : 'en'

  return (
    <p
      lang={textLanguage}
      className="max-w-4xl text-sm leading-relaxed text-muted"
    >
      {t('footer.disclaimer', { lng: textLanguage })}
    </p>
  )
}
