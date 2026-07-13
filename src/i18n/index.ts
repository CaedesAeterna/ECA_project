import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import hu from './locales/hu'
import ro from './locales/ro'
import pl from './locales/pl'

// Remember the visitor's language choice across sessions.
const STORAGE_KEY = 'eca_lang'
const savedLang = localStorage.getItem(STORAGE_KEY) ?? 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hu: { translation: hu },
      ro: { translation: ro },
      pl: { translation: pl },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes interpolated values
    },
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  // Keep the document language in sync for accessibility and SEO.
  document.documentElement.lang = lng
})

export default i18n
