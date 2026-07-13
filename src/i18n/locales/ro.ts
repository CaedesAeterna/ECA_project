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
    paragraphs: [
      'Programul ECA (Emoție–Cogniție–Acțiune) este o inițiativă pedagogică inovatoare. Fundamentul său intelectual este pedagogia centrată pe persoană, care se bazează pe unicitatea elevilor, pe motivația lor interioară și pe siguranța emoțională.',
      'Acronimul ECA reprezintă unitatea dintre Emoție, Cogniție și Acțiune. Acest model subliniază că procesul de învățare devine complet atunci când elevii se conectează emoțional cu materia, o prelucrează cognitiv și apoi își aplică cunoștințele prin acțiune activă. Scopul programului este ca cei mici nu doar să dobândească cunoștințe, ci și să se bucure de procesul de învățare și să își poată lega studiile de propria viață.',
      'Un obiectiv prioritar al nostru este să dezvoltăm o practică pedagogică ce poate oferi un model pentru învățământul public. ECA oferă o viziune adaptabilă și un set de instrumente metodologice care pot fi integrate și în mediul școlar tradițional. În dezvoltarea programului colaborăm cu organizația poloneză Gedania1922, partenerul nostru în această activitate în cadrul proiectului Erasmus+.',
      'Grupul-țintă al programului este format din copii din clasele 1–4 și din cadrele didactice. Este deosebit de important pentru noi să asigurăm un mediu de învățare potrivit și pentru copiii cu un nivel de activitate ridicat, greu de reglat. Programul se bazează în mod conștient pe particularitățile de vârstă, întrucât nevoile fundamentale ale școlarilor mici sunt mișcarea, jocul, explorarea și conectarea socială.',
      'Pe parcursul programului ECA iau naștere și produse concrete: un curriculum bazat pe logica ECA, un manual practic și un curriculum de formare continuă pentru cadrele didactice. În ansamblu, scopul programului ECA este crearea unui mediu de învățare în care copiii participă activ, cu bucurie și în mod personal, oferind în același timp cadrelor didactice instrumente noi, aplicabile flexibil, pentru munca de zi cu zi.',
    ],
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
