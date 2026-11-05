import { useTranslation } from 'react-i18next'
import disclaimerHu from '../assets/eu-disclaimer-hu.png'
import disclaimerEn from '../assets/eu-disclaimer-en.png'

export default function FundingDisclaimer() {
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage ?? 'en').slice(0, 2)
  const imageLanguage = language === 'hu' ? 'hu' : 'en'
  const source = imageLanguage === 'hu' ? disclaimerHu : disclaimerEn

  return (
    <a
      href={source}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('footer.openDisclaimer')}
      className="block w-full max-w-5xl rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
    >
      <img
        src={source}
        alt={t('footer.disclaimer', { lng: imageLanguage })}
        lang={imageLanguage}
        width={imageLanguage === 'hu' ? 1078 : 1035}
        height={imageLanguage === 'hu' ? 157 : 84}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
      />
    </a>
  )
}
