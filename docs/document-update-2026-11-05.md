# Tudásforrás és eredmények – 2026. november 5.

Forráscsomag: `../drive-download-20261105T181632Z-1-001/`.

## Megjelenés és nyelvek

A menüpont és az oldal címe magyarul **Tudásforrás és eredmények**, angolul
**Resources and Results**, lengyelül **Baza wiedzy i rezultaty**.

A fő eredmények az alábbi sorrendben jelennek meg. Minden eredményhez saját
ismertető és közvetlen PDF-letöltés tartozik; a nyelvválasztó a megfelelő
nyelvű dokumentumokat mutatja.

| Sorrend | Eredmény | Magyar | Angol | Lengyel |
| --- | --- | --- | --- | --- |
| 1 | ECA tanterv | Igen | Igen | Igen |
| 2 | ECA tanári kézikönyv | Igen | Igen | Igen |
| 3 | ECA tanári továbbképzési terv | Igen | Igen | Igen |
| 4 | ECA gyakorlati feladatgyűjtemény | Igen | Igen | Igen |
| 5 | ECA jó gyakorlatok útmutató | Igen | Igen | Igen |
| 6 | ECA kártyák és felhasználási segédlet | Igen | Igen | — |
| 7 | ECA sablonok | Igen | Igen | Igen |
| 8 | A nagy ECA könyv | Igen | — | — |

Ez **21 fő PDF-et** jelent: magyarul 8, angolul 7, lengyelül 6.
A korábbi különálló óravázlatok, feladatlapok, házi feladatok és kérdésgyűjtemény
a fő eredmények alatt, a további tananyagok között érhető el. Így összesen
52 PDF szerepel a tartalomjegyzékben.

A hosszabb menücím miatt a mobilmenü 1024 pixel alatti szélességnél jelenik meg.
A letöltési lista külön jelzi a betöltést és a dokumentumjegyzék lekérési hibáját.

## Lábléc

- Magyar oldalak: a megadott magyar nyilatkozat valódi HTML-bekezdésként jelenik meg.
- Angol és lengyel oldalak: az eredeti angol nyilatkozat jelenik meg, szintén
  szövegként. A bekezdés nyelvi jelölése ezeken az oldalakon `en`.
- A nyilatkozat minden aloldal közös láblécében olvasható, kijelölhető és mobilon
  tördelhető. A korábbi két láblécképet és a képmegnyitási hivatkozást eltávolítottuk.

## Ismertetők és frissített fájlok

Az eredményleírások alapja a csomag `Result texts.docx` fájlja.
A magyar kézikönyv címe alatt ebben tévedésből a tréning angol leírása
szerepelt; ezt a kézikönyv helyes angol ismertetőjének magyar fordítása
helyettesíti. A lengyel sablonokhoz a lengyel PDF tartalmának megfelelő
ismertető készült. A könyv három magyar bekezdése a megadott szövegből
került át.

A kártyák és segédletek most nyelvenként egy összevont PDF-ben szerepelnek.
A két korábbi külön segédletet ezek váltották fel. A korábbi közös EN/HU
sablon helyett három külön nyelvi fájl található. A régi különálló
eredményösszefoglaló szerepét az oldalon megjelenő részletes ismertetők vették át.

A 21 PDF közül 8 már bájtra azonos volt az új csomaggal, 10 meglévő fájl
frissült, és 3 új sablon került be. A forrásfájlok megmaradtak.
A meglévő dokumentumok útvonalai a sablonok kivételével megmaradtak.

A csomag `8. ECA Website.pdf` fájlja egyetlen, a honlap címét tartalmazó oldal;
nem került be kilencedik eredménytípusként a kért nyolc mellé.

## Ellenőrzés

- Sikeres TypeScript-ellenőrzés és Vite build (`yarn build`).
- A módosított PHP-fájlok szintaktikailag helyesek (`php -l`).
- A tényleges React-komponensek automatikus renderelése mindhárom nyelven
  ellenőrizte a fő eredmények sorrendjét, a 8/7/6 nyelvi elérhetőséget,
  a lábléc valódi szövegét, nyelvét és az összes megjelenő PDF-hivatkozást.
- Mindhárom nyelven helyes a betöltési és hibajelzés; nincs hiányzó fordítási kulcs.
- A 21 fő PDF ellenőrzőösszege megegyezik az új forráscsomag megfelelő fájljával.
  A PDF-ek `pdfinfo` és `pdftotext` segítségével olvashatók.
- A tényleges Vite media-middleware a tartalomjegyzéket és mind az 52 PDF-et
  a megfelelő bájttartalommal és MIME-típussal szolgálja ki az ellenőrzésben.
- A korábbi további tananyagok, eseményadatok, galériák és témabeállítások
  változatlanságát is ellenőriztük.

A Chromium indítását a környezet `setsockopt: Operation not permitted`
hibával letiltotta, ezért a renderelési ellenőrzés böngésző nélkül történt.

## Hiányzó eredménycsoportok javítása

A négy jelzett csoport mind a 11 PDF-je már megvolt és egyezett a forráscsomaggal.
A megjelenítés azonban kizárólag a futás közben lekért CMS-tartalomjegyzéktől
függött. A korábbi alkalmazásbuild nem tartalmazott PDF-eket, a normál deploy
pedig nem frissítette a CMS tartalomjegyzékét. Egy régebbi éles tartalomjegyzék
ezért elrejthette az új csoportokat.

A `src/data/project-results.json` és a `src/assets/project-results/` most külön,
verziózott kiadási példányként tartalmazza a 21 fő PDF-et és a nyelvi besorolást.
A Vite ezeket a `dist/assets/` könyvtárba építi, ezért a normál alkalmazásdeploy
is feltölti a fájlokat. Ez a példány a CMS visszafelé futó médiaszinkronjától
függetlenül megmarad.

- Ha egy kategória nyelvi bejegyzése hiányzik az éles tartalomjegyzékből, az
  oldal a kiadáshoz mellékelt dokumentumokat és azok buildelt hivatkozását mutatja.
- Ha a CMS-ben létezik a bejegyzés, annak dokumentumai, címei és `/media/`
  hivatkozásai érvényesek. A kiadási példány nem írja felül az éles CMS-fájlokat.
- A CMS-ben kifejezetten üresre törölt lista továbbra is üres marad.
- Sikertelen tartalomjegyzék-lekéréskor a 21 fő PDF elérhető; a hibaüzenet
  a további tananyagok betöltésére vonatkozik.

A kiadási dokumentumok addig nem szerepelnek az adminfelület listájában, amíg
nincs hozzájuk éles CMS-bejegyzés. Az adminisztrátor az adott kategória és nyelv
alatti feltöltéssel veheti át a kezelésüket. Új hivatalos dokumentumkiadáskor
a külön kiadási példányt is frissíteni kell; részletek a `server/README-cms.md` fájlban.

Az ellenőrzés régi és teljesen üres tartalomjegyzékkel, sikertelen lekéréssel,
szándékos CMS-törléssel és egyéni CMS-fájlokkal is lefutott magyarul, angolul és
lengyelül. Mind a 21 buildelt PDF bájtra egyezik a kiadási és forrásfájlokkal.

## Élesítés

A változások a helyi projektben készültek el. Éles feltöltés, commit és push
nem történt ebben a javításban. A szokásos alkalmazásdeploy most a fő eredmények
PDF-jeit is tartalmazza a buildelt assetek között. A `server/media/` könyvtár
és az események, galériák, további CMS-feltöltések, témabeállítások továbbra is
az éles CMS kezelésében maradnak; a tárhelyről visszafelé futó szinkron ezt a
médiastruktúrát menti a repóba.

## Fájljegyzék

A célutak a `server/media/` könyvtárhoz képest relatívak.

| Forrás | Nyelv | Cél |
| --- | --- | --- |
| `1. ECA Curriculum/ECA Curriculum EN.pdf` | EN | `resources/curriculum/en/eca-tanterv-konyv-en-2026-06-24.pdf` |
| `1. ECA Curriculum/ECA Program Nauczania PL.pdf` | PL | `resources/curriculum/pl/eca-curriculum-pl-wersja-finalna-docx.pdf` |
| `1. ECA Curriculum/ECA tanterv HU.pdf` | HU | `resources/curriculum/hu/eca-tanterv-konyv-hu-2026-06-24.pdf` |
| `2. ECA Teacher_s Handbook/ECA Podrecznik poprawiony PL.pdf` | PL | `resources/handbook/pl/eca-handbook-pl-erasmus-final.pdf` |
| `2. ECA Teacher_s Handbook/ECA Teacher_s Handbook EN .pdf` | EN | `resources/handbook/en/eca-handbook-en.pdf` |
| `2. ECA Teacher_s Handbook/ECA tanári kézikönyv HU.pdf` | HU | `resources/handbook/hu/eca-tanari-kezikonyv-hu.pdf` |
| `3. ECA Teacher Training Plan/ECA Plan Nausczania PL.pdf` | PL | `resources/training_plan/pl/eca-plan-szkolenia-nauczycieli-pl.pdf` |
| `3. ECA Teacher Training Plan/ECA Teacher Training Plan .pdf` | EN | `resources/training_plan/en/eca-teacher-training-plan-en.pdf` |
| `3. ECA Teacher Training Plan/ECA tanár továbbképzési terv HU.pdf` | HU | `resources/training_plan/hu/eca-tanari-tovabbkepzesi-terv-hu.pdf` |
| `4. ECA Practical Activity Collection/ECA Practical Activity Collection EN.pdf` | EN | `resources/activities/en/eca-50-practical-activities-en.pdf` |
| `4. ECA Practical Activity Collection/ECA Zbiór Praktychnicz Materialów PL.pdf` | PL | `resources/activities/pl/eca-50-praktycznych-cwiczen-pl.pdf` |
| `4. ECA Practical Activity Collection/ECA gyakorlati feladatgyűjtemény HU.pdf` | HU | `resources/activities/hu/eca-50-gyakorlati-feladat-hu.pdf` |
| `5. ECA Best Practice/ECA Best Practice Guidelines EN.pdf` | EN | `resources/practice/en/eca-best-practice-en.pdf` |
| `5. ECA Best Practice/ECA Wytyczne Dotyczace Najlepszych Praktyk PL.pdf` | PL | `resources/practice/pl/eca-best-practice-pl.pdf` |
| `5. ECA Best Practice/ECA jó gyakorlatok útmutató HU.pdf` | HU | `resources/practice/hu/eca-jo-gyakorlatok-hu.pdf` |
| `6. ECA Cards and User Guide En, HU,/ECA Cards and User Guide EN.pdf` | EN | `resources/cards/en/eca-cards-en.pdf` |
| `6. ECA Cards and User Guide En, HU,/ECA kártyák és felhasználási segédlet_HU.pdf` | HU | `resources/cards/hu/eca-kartyak-hu.pdf` |
| `7. ECA Templates/ECA Szablony_PL.pdf` | PL | `resources/templates/pl/eca-szablony-pl.pdf` |
| `7. ECA Templates/ECA Templates EN.pdf` | EN | `resources/templates/en/eca-templates-en.pdf` |
| `7. ECA Templates/ECA sablonok_HU.pdf` | HU | `resources/templates/hu/eca-sablonok-hu.pdf` |
| `9. A nagy ECA könyv.pdf` | HU | `resources/book/hu/eca-konyv-hu.pdf` |
