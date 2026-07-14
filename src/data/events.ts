// Event report content, bootstrapped once from the per-event .docx files and
// now the editable source of truth (edit here to fix wording or add events;
// images are loaded separately in EventsPage.tsx by matching `folder`).
// A Block is a paragraph (string), a lead paragraph, a sub-heading, a bullet
// list, or a signature line. Bodies are per language; PL falls back to EN.

export type Block =
  | string
  | { lead: string }
  | { h: string }
  | { list: string[] }
  | { sig: string }

export type EventEntry = {
  date: string
  folder: string // must match the sub-folder under assets/gallery/events/<country>/
  title: { hu: string; en: string }
  body: { hu: Block[]; en: Block[] }
}

export const eventsByCountry: { hu: EventEntry[]; pl: EventEntry[] } = {
  "hu": [
    {
      "date": "2026.03.13",
      "folder": "2026.03.13. Jászberény tanóra HU, EN",
      "title": {
        "hu": "ECA workshop Jászberényben",
        "en": "ECA Workshop in Jászberény"
      },
      "body": {
        "hu": [
          {
            "lead": "Mitől lesz egy tanulási élmény igazán maradandó? Attól, hogy sok információt kapunk? Vagy attól, hogy valami megérint bennünket közben?"
          },
          {
            "lead": "Egy jászberényi egyetemi workshopon azt kerestük, hogyan lehet a tanulás egyszerre élmény, gondolkodás és cselekvés."
          },
          {
            "h": "Egy délelőtt, ami nem „óra” volt"
          },
          "Az Eszterházy Károly Katolikus Egyetem Jászberényi Campusán 33 levelezős hallgató és 5 középiskolás diák vett részt egy háromórás foglalkozáson. A legfiatalabbak számára ez választott foglalkozás volt, a hallgatók számára pedig a kötelező órakeretbe épült be ez az alkalom. A cél nem egy újabb tananyag átadása volt, hanem egy egészen másfajta tanulási élmény megteremtése. Törekedtünk rá, hogy a résztvevők ne passzív hallgatók, hanem aktív alakítói legyenek a folyamatnak.",
          {
            "h": "Mi az az ECA?"
          },
          "Az ECA három egyszerű, mégis alapvető dolgot jelent:",
          {
            "list": [
              "Érzelem – hogyan érzem magam, biztonságban vagyok-e",
              "Kogníció – mit értek meg, hogyan gondolkodom",
              "Akció – mit próbálok ki, mit teszek"
            ]
          },
          "Ha ez a három egyensúlyban van, akkor a tanulás valóban működni kezd.",
          {
            "h": "Nem beszéltünk róla – csináltuk!"
          },
          "A délelőtt során a résztvevők:",
          {
            "list": [
              "játékokon keresztül kapcsolódtak egymáshoz",
              "saját élményeken alapján gondolkodtak a tanulásról",
              "kreatív feladatokban próbálták ki az együttműködést",
              "saját programokat terveztek",
              "együtt gondolkodtak és reflektáltak az egész folyamat értelmére"
            ]
          },
          "Volt szoborjáték, közös alkotás helyzetgyakorlat, ötletelés – és közben folyamatosan született valami fontos felismerés: tanulni nem lehet bevonódás nélkül.",
          "A workshop egyik kulcskérdése ez volt: „Hol vagyok én a tanulási folyamatban?” Tanítóként, szülőként, segítőként – mennyire vagyok jelen? Figyelek-e a másikra? Teret adok-e neki?",
          {
            "h": "Mit vittek haza?"
          },
          "A résztvevők a nap végén címeket adtak az élményüknek, és megfogalmazták, mit mesélnének róla másoknak. Sokféle válasz született, de egy dolog közös volt: ez a délelőtt nem csak a fejükhöz szólt, hanem egész lényükhöz: érzelmeikhez, testükhöz, intellektusukhoz egyaránt. És talán ez a tanulás valódi lényege."
        ],
        "en": [
          {
            "lead": "What makes a learning experience truly memorable? Is it receiving a great deal of information? Or is it being deeply touched by the process?"
          },
          {
            "lead": "At a university workshop in Jászberény, we explored how learning can become an experience that combines emotion, cognition and action."
          },
          {
            "h": "A Morning That Was More Than a Lesson"
          },
          "At the Jászberény Campus of Eszterházy Károly Catholic University, 33 part-time university students and 5 secondary school students participated in a three-hour workshop. For the younger participants, it was an optional activity, while for the university students it formed part of their compulsory coursework. The aim was not to deliver another piece of course content, but to create a completely new kind of learning experience. We sought to ensure that participants were not passive listeners but active contributors to the learning process.",
          {
            "h": "What Is ECA?"
          },
          "ECA stands for three simple yet fundamental elements:",
          {
            "list": [
              "Emotion – How do I feel? Do I feel safe?",
              "Cognition – What do I understand? How do I think?",
              "Action – What do I try? What do I do?"
            ]
          },
          "When these three elements are in balance, learning truly begins to work.",
          {
            "h": "We Did Not Talk About It – We Experienced It"
          },
          "During the morning, participants:",
          {
            "list": [
              "connected with one another through games;",
              "reflected on learning through their own experiences;",
              "explored cooperation through creative activities;",
              "designed their own educational programmes;",
              "reflected together on the entire process."
            ]
          },
          "There were statue games, collaborative creative tasks, role-play activities, brainstorming sessions—and throughout the workshop, important insights continued to emerge: meaningful learning cannot happen without genuine engagement. One of the key questions of the workshop was: \"Where am I in the learning process?\" As a teacher, a parent, or a facilitator—how present am I? Do I truly pay attention to the other person? Do I create space for them?",
          {
            "h": "What Did Participants Take Home?"
          },
          "At the end of the workshop, participants gave titles to their experience and described what they would tell others about it. Although the responses were diverse, one thing was common to all of them: this morning spoke not only to their minds, but to their whole selves—their emotions, their bodies, and their intellect alike. And perhaps that is the true essence of learning."
        ]
      }
    },
    {
      "date": "2026.04.02",
      "folder": "2026.04.02. Magnet ház élménynap HU, EN",
      "title": {
        "hu": "Élménynap a MagNet Házban",
        "en": "Experience Day at MagNet House"
      },
      "body": {
        "hu": [
          {
            "lead": "Április 2-án a MagNet Házban érdekes élménynapot tartottunk, ahol négy izgalmas, Erasmus+ támogatással megvalósuló projekt mutatkozott be. Három ezekből a Rogers Alapítvány büszkesége – a Move and Play, a Playful Parents és az új, még csak most induló Octopus –, míg a negyedik, az ECA program, a Meseliget Alapítvány kezdeményezése. ahol a Rogers Alaptvány együttműködő partnerként vesz részt."
          },
          "A napot egy rövid, barátságos köszöntővel indítottuk, majd bemutatkozott a négy projekt. Az Octopus még a munka elején tart, az ECA már a középső szakaszban jár, két projekt pedig nyáron zárulnak.",
          "Ezt követően a résztvevők két csoportban vettek részt az egyórás workshopokon. Az ECA  Lendek Réka és Hegedűs Julcsi vezetésével mutatta be módszertanát. A program közepén egy csoportváltás biztosította, hogy mindenki bepillantást nyerhessen mindhárom projektbe. Az ismerkedés és érzelmi ráhangolódás után a feladat az volt, hogy jelenítsük meg az oktatás múltját, jelenét és jövőjét.  A játékosság érdekében párokba rendeződtek a résztvevők, a megjelenítés módját azzal tettük változatossá, hogy a Gardner intelligencia területek szerinti aktivitásokat húztak a párok (rajz, pantomim, versírás, elmetérkép stb)",
          "A napot jókedv, kíváncsiság és inspiráló hangulat jellemezte. Délelőtt 10 órakor kezdtünk, és 13 órakor zártuk a programot."
        ],
        "en": [
          {
            "lead": "On 2 April, 2026 we organized an inspiring experience day at MagNet House, where four exciting Erasmus+ funded projects were presented. Three of them are projects of the Rogers Foundation – Move and Play, Playful Parents, and the newly launched Octopus – while the fourth, the ECA programme, is an initiative of the Meseliget Foundation."
          },
          "The day began with a short and friendly welcome, followed by introductions to the four projects. Octopus is still at the beginning of its implementation, ECA has already reached its middle phase, while the other two projects will be completed during the summer. After the introductions, participants took part in one-hour workshops in two groups. The ECA methodology was presented by Réka Lendek and Julcsi Hegedűs. Halfway through the programme, the groups changed places, allowing everyone to gain an insight into all projects.",
          "Following the introductory activities and emotional warm-up, participants were invited to represent the past, present, and future of education. To make the activity more playful, they worked in pairs. Each pair drew a task based on one of Gardner's multiple intelligences, determining the form of their presentation, such as drawing, pantomime, poetry writing, mind mapping, and other creative approaches.",
          "The day was characterized by a cheerful atmosphere, curiosity, and inspiration. The programme started at 10:00 a.m. and concluded at 1:00 p.m."
        ]
      }
    },
    {
      "date": "2026.04.25",
      "folder": "2026. 04. 25. Szokolya workshop HU, EN",
      "title": {
        "hu": "Ökológiai makettezés – Szokolya",
        "en": "Ecological Model Making – Szokolya"
      },
      "body": {
        "hu": [
          {
            "lead": "Az április 25-én megrendezett Vidék-Egészség-Építészet családi nap a szokolyai Kacár tanyán nem csupán egy hagyományos építészeti bemutató volt. A program célja a környezettudatos életmód és a fenntartható építészet népszerűsítése volt egy olyan közegben, ahol a tanulás mélyebb, személyesebb és élményekkel teli folyamattá vált."
          },
          {
            "lead": "Az Ökológiai Makettezés program a fenntarthatóság alapjait a természetben megfigyelt mintákon és az együtt alkotás élményén keresztül tanítja meg a gyerekeknek. A program Kis Bálint építész-tanító vezetésével valósult meg, aki a szokolyai workshopon az érdi Rogers Jurtasuliban kiforrott EKA szemléletre (Emóció–Kogníció–Akció hármas egysége) építve kalauzolta a gyerekeket."
          },
          {
            "h": "1. Emóció: Biztonság és kapcsolódás a tanyán"
          },
          "Az ECA-szemlélet szerint az érzelmi biztonság a tanulás „belépési kapuja”. A program helyszínéül szolgáló természetes környezet, a szokolyai Kacár tanya kulcsszerepet játszott a ráhangolódásban. A gyerekek közvetlenül, szabadon kapcsolódhattak a földhöz, a vízhez, a növényekhez, ami mély érzelmi érintettséget és felszabadult alkotókedvet eredményezett. A foglalkozások ismerkedéssel indultak, amit kötetlen beszélgetés követett, ahol a gyerekek saját megfigyeléseiket oszthatták meg egymás között az állatok és a természet viszonyáról. Ez a befogadó légkör biztosította, hogy a gyerekek felszabadultan, bátran alkothassanak, megszabadulva az ismeretlenség okozta természetes frusztrációtól. A gyerekek személyesen, a szülők közvetve, a hazaindulást késleltető maradni akarás kapcsán élhették át, hogy a természetes anyagokkal való érintkezés olyan stabil érzelmi kötődést és belső motivációt generált, amely a foglalkozás végéig fenntartotta a nyitott és befogadó állapotot, melyről mellesleg tudjuk, hogy a fizikális tevékenység mellett nagyban hozzájárul a kapott információk tartós bevésődéséhez.",
          {
            "h": "2. Kogníció: A természet, mint építőmester"
          },
          "Kognitív síkon a gyerekek a természetben fellelhető építési mintákat és technikai megoldásokat fedezték fel. A program olyan témákat érintett, mint a rétegzés (hódvárak és gólyafészkek stabilitásának megértése), a fonás és szövés (szövőmadarak technikái és a fűszálak teherbírása), vagy a tapasztás (fecskék vályoghasználata, a sár-növényi részek keverékének összetettsége, kapcsolatok ereje). A gyerekek nem készen kapták a tudást. A közös ötletelés és kísérletezés során maguk jöttek rá az összefüggésekre, a tévutakra, vagy a javítási feladatokra. Ez a felfedező tanulás segítette megfigyelő-, összehasonlító, rendszerező, felismerő képességük és a kritikus gondolkodásuk fejlődését is.",
          {
            "h": "3. Akció: Alkotás és tapasztalatszerzés"
          },
          "A foglalkozás látványos része az alkotás, ahol az érzelmi motiváció és a kognitív tudás cselekvésben teljesedik ki, majd ez visszacsatol mindhárom dimenzióra. A gyerekek a tanya különböző pontjairól gyűjtöttek anyagokat (füveket, ágakat, vályog-összetevőket), majd saját koncepciójuk alapján készítették el a modelljeiket. Az anyaggyűjtés és az alkotás során megélt élmények révén a természet nem elvont fogalomként, hanem élő, megtapasztalható valóságként él a gyermekfejekben, amelyben az érzelem, a megismerés és a cselekvés egysége a tudás öntudatlan rögzülését eredményezi. A technikai kihívások teljesítésére együttműködő segítséget lehetett adni és kapni. A sikerélmény nem egy külső mércének való megfelelésből, hanem a kísérletezésből és az alkotás öröméből fakadt. Sok szép és ötletes eredmény született, melyből kis kiállítást is rendeztünk. Mindenki büszkén mutatta be a saját alkotását, miközben egymástól is rengeteg inspirációt merítettek.",
          "Hisszük, hogy az Ökológiai Makettezés a környezeti, fenntarthatóságra nevelés egyik leghatékonyabb módja, és a legideálisabb ezt a természetben, valamint személyközpontú légkörben megélni. A visszajelzések alapján a Kacár tanyán töltött nap végére a természet egy közösen építhető és védendő valóságot jelentett minden érintett család számára.",
          {
            "sig": "Kis Bálint és a Rogers Jurtasuli tanítói köre"
          }
        ],
        "en": [
          {
            "lead": "The Rural Health Architecture Family Day, held on 25 April at Kacár Farm in Szokolya, was much more than a traditional architectural demonstration. The aim of the programme was to promote environmentally conscious living and sustainable architecture in a setting where learning became a deeper, more personal, and experience-based process."
          },
          {
            "lead": "The Ecological Model Making programme introduces children to the foundations of sustainability through patterns observed in nature and the shared experience of creating together. The programme was led by architect and educator Bálint Kis, who guided the children through the workshop using the ECA approach (Emotion–Cognition–Action), developed at the Rogers Yurtschool in Érd."
          },
          {
            "h": "1. Emotion: Safety and Connection at the Farm"
          },
          "According to the ECA approach, emotional safety is the \"gateway\" to learning. The natural environment of Kacár Farm played a key role in helping participants become emotionally engaged. Children were able to connect freely and directly with soil, water, and plants, creating a deep sense of involvement and a joyful willingness to create.",
          "The session began with introductions, followed by informal conversations during which the children shared their own observations about animals and their relationship with nature. This welcoming atmosphere allowed them to create freely and confidently, overcoming the natural uncertainty that often accompanies unfamiliar situations.",
          "Children experienced this directly, while parents experienced it indirectly through their children's reluctance to leave at the end of the day. Contact with natural materials generated a strong emotional connection and intrinsic motivation that remained present throughout the workshop, maintaining an open and receptive state. We also know that, alongside physical activity, such a state significantly contributes to the long-term retention of newly acquired knowledge.",
          {
            "h": "2. Cognition: Nature as a Master Builder"
          },
          "On the cognitive level, the children explored construction patterns and engineering solutions found in nature. The programme covered topics such as layering (understanding the stability of beaver lodges and stork nests), weaving and braiding (the techniques of weaver birds and the strength of grass fibres), and plastering (how swallows use mud, and the complex mixture of clay and plant materials that demonstrates the strength of connections).",
          "Knowledge was never simply presented to the children. Through collective brainstorming and experimentation, they discovered relationships, recognised mistakes, and identified possible improvements themselves. This inquiry-based learning supported the development of their observation, comparison, classification, pattern recognition, and critical thinking skills.",
          {
            "h": "3. Action: Creating and Learning Through Experience"
          },
          "The most visible part of the programme was the creative construction process, where emotional motivation and cognitive understanding came together through action, reinforcing all three dimensions of learning.",
          "The children collected materials from different areas of the farm, including grasses, branches, and components for clay mixtures, and then created their own models based on their individual ideas.",
          "Through collecting materials and building their models, nature became a living reality that could be experienced directly.",
          "During the technical challenges, participants both offered and received support through cooperation. Many beautiful and imaginative models were produced, and a small exhibition was organised at the end of the workshop.",
          {
            "sig": "Bálint Kis and the Teaching Team of the Rogers Yurtschool"
          }
        ]
      }
    },
    {
      "date": "2026.04.26",
      "folder": "2026.04.26. Mom Park Föld Napja HU, EN",
      "title": {
        "hu": "Föld Napja a MOM Parkban",
        "en": "Earth Day at MOM Park"
      },
      "body": {
        "hu": [
          {
            "lead": "A Föld Napja alkalmából a Meseliget Alapítvány egész napos kitelepüléssel vett részt a MOM Park rendezvényén. Célunk az volt, hogy a nyüzsgő szabadtéri programok mellett egy olyan csendes, befogadó teret hozzunk létre, ahol a látogatók megpihenhetnek, elidőzhetnek és saját élményen keresztül találkozhatnak az ECA szemlélettel. A stand kialakításakor tudatosan törekedtünk arra, hogy a látvány, az interaktív tevékenységek és a személyes beszélgetések egyaránt helyet kapjanak."
          },
          "A kis indián sátorban egyszerű, természetes anyagokra épülő programok várták a gyerekeket. Nagy népszerűségnek örvendett a kavicsokkal játszható mankala. A diótörés szintén sok látogatót megszólított: egy hétköznapi tevékenységen keresztül mutatta meg, hogy a természetes anyagokkal végzett közös munka önmagában is élmény lehet.",
          "A stand egyik központi eleme a „A kert mint osztályterem – Mit tanulhatunk egy kavicstól?” című plakát volt, amely beszélgetéseket indított arról, hogy a természet milyen gazdag tanulási környezetet kínál. A kihelyezett természetismereti könyvek, illatos növények és szemléltető anyagok segítségével a látogatók megtapasztalhatták, hogy a környezeti nevelés nem csupán az iskolai tanteremhez kötődhet, hanem bármely kerthez, parkhoz vagy erdei sétához is. A Meseliget saját kiadványai és könyvei szintén elérhetők voltak, amelyek bemutatták az ECA megközelítés gyakorlati alkalmazását.",
          "A program során számos spontán beszélgetés alakult ki pedagógusokkal, szülőkkel és családokkal arról, hogyan lehet a természetet tudatosan bevonni a gyermekek érzelmi, kognitív és gyakorlati fejlődésébe. A stand ismereteket közvetített, és élményt és szemléletet is adott: azt az üzenetet, hogy a természet egyszerre lehet tanulási tér, közösségi élmény és a megnyugvás helye."
        ],
        "en": [
          {
            "lead": "On the occasion of Earth Day, the Meseliget Foundation participated in the public event at MOM Park with an interactive stand presenting the ECA (Emotion–Cognition–Action) approach. Our aim was to create a calm and welcoming space where visitors could take a break from the busy festival atmosphere and experience how meaningful learning can emerge through simple interactions with nature."
          },
          "The stand was designed around three elements: visual attraction, activities and personal conversations. Visitors were invited to take part in quiet, nature based experiences that encouraged curiosity, reflection, and dialogue. One of the most popular activities was playing Mancala with natural stones, demonstrating how a simple traditional game can develop strategic thinking while creating opportunities for connection across generations. Walnut cracking also attracted many families.",
          "A central feature of the stand was the poster \"The Garden as a Classroom – What Can We Learn from a Stone?\" This exhibition encouraged visitors to rethink the educational potential of ordinary natural objects and inspired discussions about how gardens, parks, and outdoor environments can become authentic learning spaces. Nature books, educational publications, aromatic plants, and other learning materials further illustrated the wide range of educational opportunities offered by Nature.",
          "Throughout the day, many spontaneous conversations took place with teachers, parents, and families about person-centred education and the role of nature in supporting children's emotional, cognitive, and practical development. The stand presented the philosophy behind the ECA approach: meaningful learning happens when emotions, thinking, and action are connected through authentic experiences."
        ]
      }
    }
  ],
  "pl": []
}
