// Hungarian translations. Keep the same shape across every locale file.
const hu = {
  nav: {
    home: 'Kezdőlap',
    about: 'Rólunk',
    contact: 'Kapcsolat',
  },
  home: {
    title: 'Üdvözlünk az ECA oldalán',
    subtitle: 'Többnyelvű bemutatkozó oldal — ez egy helykitöltő kezdőlap.',
    cta: 'Tudj meg többet',
  },
  about: {
    title: 'Rólunk',
    body: 'Ez helykitöltő tartalom. Cseréld le a projekt leírására.',
    points: [
      'Első helykitöltő pont a projekt egyik céljáról.',
      'Második helykitöltő pont egy másik célról.',
      'Harmadik helykitöltő pont egy további célról.',
    ],
  },
  contact: {
    title: 'Kapcsolat',
    body: 'Lépj velünk kapcsolatba — ez helykitöltő tartalom.',
    email: 'Írj nekünk',
  },
  footer: {
    rights: 'Minden jog fenntartva.',
  },
} as const

export default hu
