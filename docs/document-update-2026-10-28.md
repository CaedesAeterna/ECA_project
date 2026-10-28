# ECA dokumentumfrissítés – 2026. október 28.

Forrás: `../drive-download-20261024T124845Z-1-001/` (2026. október 24-i Drive-letöltés).

## A projekt és a dokumentumok helye

Az ECA (Emotion–Cognition–Action / Emóció–Kogníció–Akció) a Meseliget
Alapítvány és a Gedania 1922 Erasmus+ oktatási projektje. Az alsó tagozatos
oktatásban az érzelmi bevonódást, a gondolkodást és a gyakorlati cselekvést
kapcsolja össze, személyközpontú pedagógiai megközelítéssel.

A honlap Vite + React + TypeScript alkalmazás, magyar, angol és lengyel
felülettel. A Tudásforrás oldal a `server/media/manifest.json` állományból
olvassa a dokumentumok kategóriáját, nyelvét, címét és letöltési útvonalát.
A PDF-ek helye `server/media/resources/<kategória>/<nyelv>/`.
A PHP adminfelület (`server/cms.php`, `server/cms_lib.php`) ugyanezt a
tartalomjegyzéket és fájlstruktúrát kezeli.

## A frissítés tartalma

- A forráscsomag mind a **22 PDF-je** bekerült: **9 korábbi dokumentum
  cseréje és 13 új PDF**. Az eredeti letöltött példányok megmaradtak.
- A kézikönyv, tanterv és jó gyakorlatok magyar, angol és lengyel változatát
  frissítettük. A meglévő fájlútvonalak megmaradtak, hogy a korábbi közvetlen
  hivatkozások tovább működjenek. Egyes történeti fájlnevekben ezért még
  korábbi dátum vagy „final” jelölés szerepel; a fájl tartalma már az új verzió.
- Új kategóriák: `training_plan` (továbbképzési terv), `activities`
  (50 gyakorlati feladat), `cards` (kártyák és segédletek), `templates`
  (sablonok), `book` (gyűjteményes könyv), `summary` (eredményösszefoglaló).
  A kategóriák a Tudásforrás oldalon és az adminfelületen is szerepelnek;
  mindhárom felületnyelvhez tartozik címke.
- A kétnyelvű sablongyűjtemény egyetlen fizikai példánya a `templates/shared/`
  könyvtárban van. Ugyanerre a fájlra hivatkozik az angol és a magyar lista,
  ezért 22 PDF-hez 23 nyelvi bejegyzés tartozik. A CMS-ben a közös fájl
  átnevezése vagy törlése mindkét nyelvi bejegyzésre érvényes.
- Az új könyv magyarul, az eredményösszefoglaló angolul áll rendelkezésre.
  Lengyel kártyák és lengyel sablonok nem voltak a csomagban. A kiegészítő
  anyagok kizárólag az elérhető nyelveknél jelennek meg.
- A korábban a `handbook/pl/` mappába került, a tartalomjegyzékben nem
  szereplő `Plan nauczania ECA (lengyel Training Plan) .pdf` elavult példányát
  az új `training_plan/pl/` dokumentum váltotta fel.
- A meglévő különálló óravázlatok, feladatlapok, házi feladatok,
  kérdésgyűjtemények, események, galériák és megjelenítési beállítások
  megmaradtak.

## Forrásellenőrzés és kihagyott anyagok

A besorolás a PDF-ek tartalma és nyelve alapján történt, a verziók
összevetéséhez a PDF-metaadatokat is figyelembe vettük.

- Az `ECA 50 feladat HU 2025.10.15.pdf` fájlnévben szereplő 2025-ös év
  félrevezető: a PDF létrehozási és módosítási ideje 2026. október 15.
  Az új példány évszám nélküli célfájlnevet kapott.
- A `3. ECA Teacher Training Plan/ECA Teacher Training Plan PL.pdf` törzse
  lengyel, de a borító főcíme és alcíme magyar maradt. A fájlt a lengyel
  kategóriába soroltuk; a PDF eredeti tartalmát nem szerkesztettük át.
  Ezt a forrásdokumentum következő javításakor érdemes korrigálni.
- A `Gedania1922 Garden lessons/` öt Word-dokumentuma megtartott foglalkozásokról
  szóló angol beszámoló, a mellettük lévő JPG-k pedig kapcsolódó fotók.
  Ezeket nem vettük fel PDF-tananyagként, és új eseményeket sem hoztunk létre
  belőlük. Az eredeti forrásmappában megmaradtak.
- A `7. ECA website/www.ecaproject.eu.txt` üres fájl, ezért kimaradt.

## Ellenőrzések

- `yarn build`: sikeres TypeScript-ellenőrzés és Vite build.
- `php -l server/cms.php` és `php -l server/cms_lib.php`: sikeres.
- A 22 importált PDF SHA-256 ellenőrzőösszege megegyezik az eredeti
  forrásfájléval. Mindegyikhez sikeres `pdfinfo`-olvasás és az első, illetve
  utolsó oldal sikeres Poppler-renderelése tartozik; összesen 826 oldalnyi
  dokumentum került be.
- A `qpdf --check` 17 forrás-PDF-nél exportálási figyelmeztetéseket adott:
  többnyire linearizációs hint-tábla eltéréseket, a gyűjteményes könyvnél
  rendezetlen névfa-kulcsokat. A műveletek figyelmeztetéssel befejeződtek;
  a források változatlanul kerültek át, automatikus PDF-újraírás nem történt.
- A tartalomjegyzék mind az 54 bejegyzése létező fájlra mutat (53 külön PDF;
  a kétnyelvű sablon közös). A Vite tényleges `/media/` middleware-jét
  hálózati port nyitása nélkül meghívva a tartalomjegyzék és mind az 53 PDF
  megfelelő bájttartalommal és MIME-típussal kiszolgálható.
- A normál helyi dev szerver indítását a környezet `listen EPERM` hibával
  letiltotta, ezért böngészős ellenőrzés nem történt.
- A kategóriák egyeznek az oldalon, a CMS-ben és mindhárom fordításban.
  A korábbi kiegészítő anyagok, eseményadatok és galériák változatlanságát
  is ellenőriztük.

## Közzététel

A változások a projekt helyi példányában vannak. Az éles honlap a tárhelyen
lévő `media/` könyvtárból szolgálja ki a dokumentumokat. A szokásos
alkalmazásdeploy ezt a könyvtárat nem tölti fel; a dokumentumfrissítést külön
át kell vezetni az éles CMS tartalmába. Az új kategóriákhoz a módosított
alkalmazás és PHP-fájlok is szükségesek. A tárhelyről a repóba futó
`sync-content.yml` szinkron iránya az éles tartalmat tekinti forrásnak.

Éles feltöltés, commit és push nem történt.

## Tételes fájljegyzék

Az alábbi forrásutak a Drive-letöltéshez, a célutak a projekt `server/media/`
könyvtárához képest relatívak.

| Forrás PDF | Nyelv | Célútvonal | Művelet |
| --- | --- | --- | --- |
| `1. ECA Curriculum/ECA Curriculum EN.pdf` | EN | `resources/curriculum/en/eca-tanterv-konyv-en-2026-06-24.pdf` | Frissítés |
| `1. ECA Curriculum/ECA Curriculum PL.pdf` | PL | `resources/curriculum/pl/eca-curriculum-pl-wersja-finalna-docx.pdf` | Frissítés |
| `1. ECA Curriculum/ECA Tanterv HU.pdf` | HU | `resources/curriculum/hu/eca-tanterv-konyv-hu-2026-06-24.pdf` | Frissítés |
| `2. ECA Teacher_s Handbook/ECA tanari kézikonyv HU.pdf` | HU | `resources/handbook/hu/eca-tanari-kezikonyv-hu.pdf` | Frissítés |
| `2. ECA Teacher_s Handbook/ECA tanari kézikönyv EN kész 2026.10.12.pdf` | EN | `resources/handbook/en/eca-handbook-en.pdf` | Frissítés |
| `2. ECA Teacher_s Handbook/ECA_podrecznik_PL_Handbook poprawiony.pdf` | PL | `resources/handbook/pl/eca-handbook-pl-erasmus-final.pdf` | Frissítés |
| `3. ECA Teacher Training Plan/ECA Teacher Training Plan EN.pdf` | EN | `resources/training_plan/en/eca-teacher-training-plan-en.pdf` | Új dokumentum |
| `3. ECA Teacher Training Plan/ECA Teacher Training Plan PL.pdf` | PL | `resources/training_plan/pl/eca-plan-szkolenia-nauczycieli-pl.pdf` | Új dokumentum |
| `3. ECA Teacher Training Plan/ECA Tréning terv HU.pdf` | HU | `resources/training_plan/hu/eca-tanari-tovabbkepzesi-terv-hu.pdf` | Új dokumentum |
| `4. ECA 50 Practical Activities/ECA 50 feladat EN 2026.10.15.pdf` | EN | `resources/activities/en/eca-50-practical-activities-en.pdf` | Új dokumentum |
| `4. ECA 50 Practical Activities/ECA 50 feladat HU 2025.10.15.pdf` | HU | `resources/activities/hu/eca-50-gyakorlati-feladat-hu.pdf` | Új dokumentum |
| `4. ECA 50 Practical Activities/ECA 50 feladat PL.pdf` | PL | `resources/activities/pl/eca-50-praktycznych-cwiczen-pl.pdf` | Új dokumentum |
| `5. ECA Best Practice/ECA best practice EN.pdf` | EN | `resources/practice/en/eca-best-practice-en.pdf` | Frissítés |
| `5. ECA Best Practice/ECA best practice HU.pdf` | HU | `resources/practice/hu/eca-jo-gyakorlatok-hu.pdf` | Frissítés |
| `5. ECA Best Practice/ECA best practice PL.pdf` | PL | `resources/practice/pl/eca-best-practice-pl.pdf` | Frissítés |
| `6. ECA Cards and User Guide En, HU,/ECA Cards EN 2026.09.02-KÉSZ.pdf` | EN | `resources/cards/en/eca-cards-en.pdf` | Új dokumentum |
| `6. ECA Cards and User Guide En, HU,/ECA kártya HU 2026.09.02.pdf` | HU | `resources/cards/hu/eca-kartyak-hu.pdf` | Új dokumentum |
| `6. ECA Cards and User Guide En, HU,/kartya segedlet EN.pdf` | EN | `resources/cards/en/eca-cards-user-guide-en.pdf` | Új dokumentum |
| `6. ECA Cards and User Guide En, HU,/kartya segedlet HU.pdf` | HU | `resources/cards/hu/eca-kartyak-felhasznalasi-segedlet-hu.pdf` | Új dokumentum |
| `8. ECA Templates EN, HU.pdf` | EN/HU | `resources/templates/shared/eca-templates-en-hu.pdf` | Új dokumentum |
| `9. ECA könyv HU.pdf` | HU | `resources/book/hu/eca-konyv-hu.pdf` | Új dokumentum |
| `Results summary.pdf` | EN | `resources/summary/en/eca-results-summary-en.pdf` | Új dokumentum |
