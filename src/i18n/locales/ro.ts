// Romanian translations. Keep the same shape across every locale file.
// Romanian is still tentative — to drop it, remove this file and its entry in
// src/i18n/index.ts plus the { code: 'ro' } item in LanguageSwitcher.tsx.
// Brand = Emoție · Cogniție · Acțiune -> ECA.
const ro = {
  brand: 'ECA',
  nav: {
    project: 'Proiectul ECA',
    partners: 'Parteneri',
    resources: 'Resurse',
    experience: 'Impresii',
  },
  home: {
    title: 'Bine ai venit la ECA',
    subtitle: 'Un site de prezentare multilingv — aceasta este o pagină de start temporară.',
    cta: 'Descoperă proiectul',
  },
  project: {
    title: 'Proiectul ECA',
    body: 'Acesta este conținut temporar despre proiectul ECA. Înlocuiește-l cu o descriere a obiectivelor și activităților proiectului.',
  },
  partners: {
    title: 'Parteneri',
    body: 'Acesta este conținut temporar. Prezintă aici organizațiile partenere.',
  },
  resources: {
    title: 'Resurse',
    body: 'Acesta este conținut temporar. Adună aici materiale utile și cunoștințe.',
  },
  experience: {
    title: 'Impresii',
    body: 'Acesta este conținut temporar. Împărtășește aici poveștile și experiențele din proiect.',
  },
  footer: {
    rights: 'Toate drepturile rezervate.',
  },
} as const

export default ro
