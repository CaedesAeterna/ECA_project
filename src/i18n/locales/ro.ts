// Romanian translations. Keep the same shape across every locale file.
// Romanian is still tentative — to drop it, remove this file and its entry in
// src/i18n/index.ts plus the { code: 'ro' } item in LanguageSwitcher.tsx.
const ro = {
  nav: {
    home: 'Acasă',
    about: 'Despre',
    contact: 'Contact',
  },
  home: {
    title: 'Bine ai venit la ECA',
    subtitle: 'Un site de prezentare multilingv — aceasta este o pagină de start temporară.',
    cta: 'Află mai multe',
  },
  about: {
    title: 'Despre',
    body: 'Acesta este conținut temporar. Înlocuiește-l cu o descriere a proiectului.',
    points: [
      'Primul punct temporar care descrie un obiectiv al proiectului.',
      'Al doilea punct temporar care descrie un alt obiectiv.',
      'Al treilea punct temporar care descrie un obiectiv suplimentar.',
    ],
  },
  contact: {
    title: 'Contact',
    body: 'Ia legătura cu noi — acesta este conținut temporar.',
    email: 'Scrie-ne',
  },
  footer: {
    rights: 'Toate drepturile rezervate.',
  },
} as const

export default ro
