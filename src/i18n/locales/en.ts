// English translations. Keep the same shape across every locale file.
const en = {
  nav: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
  },
  home: {
    title: 'Welcome to ECA',
    subtitle: 'A multilingual presentation site — this is a placeholder home page.',
    cta: 'Learn more',
  },
  about: {
    title: 'About',
    body: 'This is placeholder content. Replace it with a description of the project.',
    points: [
      'First placeholder point describing a goal of the project.',
      'Second placeholder point describing another goal.',
      'Third placeholder point describing a further goal.',
    ],
  },
  contact: {
    title: 'Contact',
    body: 'Get in touch — this is placeholder contact content.',
    email: 'Email us',
  },
  footer: {
    rights: 'All rights reserved.',
  },
} as const

export default en
