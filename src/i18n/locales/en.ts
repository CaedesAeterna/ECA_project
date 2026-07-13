// English translations. Keep the same shape across every locale file.
const en = {
  // Wordmark shown in the header/footer. Per-language acronym of
  // Emotion · Cognition · Action (EN: Emotion-Cognition-Action -> ECA).
  brand: 'ECA',
  nav: {
    project: 'The ECA Project',
    partners: 'Partners',
    resources: 'Resources',
    experience: 'Experience Report',
  },
  home: {
    title: 'Welcome to ECA',
    subtitle: 'A multilingual presentation site — this is a placeholder home page.',
    cta: 'Discover the project',
  },
  project: {
    title: 'The ECA Project',
    // NOTE: en/ro/pl bodies are AI drafts of the Hungarian source — review before publishing.
    paragraphs: [
      'The ECA programme (Emotion–Cognition–Action) is an innovative pedagogical initiative. Its intellectual foundation is person-centred pedagogy, which builds on learners’ individuality, intrinsic motivation and emotional security.',
      'The acronym ECA stands for the unity of Emotion, Cognition and Action. This model emphasises that the learning process becomes complete when students connect emotionally with the material, process it cognitively, and then apply their knowledge through active engagement. The aim of the programme is that children not only acquire knowledge, but also enjoy the learning process and are able to relate their studies to their own lives.',
      'A key goal of ours is to develop pedagogical practice that can serve as a model for public education. ECA offers an adaptable approach and a methodological toolkit that can also be built into a traditional school environment. In developing the programme we cooperate with the Polish organisation Gedania1922, our partner in this work within the Erasmus+ project.',
      'The programme’s target group consists of children in grades 1–4 and their teachers. It is especially important to us to provide a suitable learning environment for children with hyperactive, hard-to-regulate activity levels as well. The programme consciously builds on age-specific characteristics, since movement, play, discovery and social connection are fundamental needs of the early-primary age group.',
      'The ECA programme also yields tangible products: a curriculum based on the ECA logic, a practical handbook, and a teacher in-service training curriculum. Overall, the ECA programme aims to create a learning environment in which children take part in learning actively, joyfully and personally, while also offering teachers new, flexibly applicable tools for their everyday work.',
    ],
  },
  partners: {
    title: 'Partners',
    body: 'This is placeholder content. Introduce the partner organisations here.',
  },
  resources: {
    title: 'Resources',
    body: 'This is placeholder content. Collect useful materials and knowledge here.',
  },
  experience: {
    title: 'Experience Report',
    body: 'This is placeholder content. Share stories and experiences from the project here.',
  },
  footer: {
    rights: 'All rights reserved.',
  },
} as const

export default en
