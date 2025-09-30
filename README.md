# Skipulagsfræðingafélag Íslands vefur

Astro verkefni sem þjónar sem opinber vefur Skipulagsfræðingafélags Íslands. Vefurinn sækir fréttir og efni úr Sanity CMS verkefninu `cpe0lcma` og birtir á forsíðu og sérstökum fréttasíðum.

## Uppsetning

1. Afritaðu umhverfisskilgreiningar:

   ```sh
   cp .env.example .env
   ```

2. Settu eftirfarandi gildi í `.env` (sjá nánar hér að neðan):

   ```ini
   SANITY_PROJECT_ID=cpe0lcma
   SANITY_DATASET=production
   SANITY_API_VERSION=2024-01-01
   # SANITY_API_READ_TOKEN=skráður_sanity_read_token (valkvætt ef dataset er lokað)
   # SANITY_USE_CDN=false  # stilltu á false ef þú þarft alltaf ferskt efni
   ```

3. Settu upp háð og ræstu þróunarþjón:

   ```sh
   npm install
   npm run dev
   ```

Vefurinn er sjálfgefið byggður sem Static Site Generation, þannig að Astro sækir fréttir úr Sanity við byggingu. Ef þú notar einkagögn þarf `SANITY_API_READ_TOKEN` með `read` heimildum.

## Skipulag

- `src/lib/sanity.ts` stillir Sanity client með því að lesa umhverfisskilyrði.
- `src/lib/news.ts` inniheldur gagnasöfnun og hjálparföll fyrir fréttir.
- `src/lib/portableText.ts` umbreytir Portable Text yfir í HTML með sérstilltri myndameðhöndlun.
- `src/pages/frettir/index.astro` sýnir allar fréttir og `src/pages/frettir/[year]/[month]/[day]/[slug].astro` birtir einstakar færslur með dagsetningu í slóð.
- Forsíðan (`src/pages/index.astro`) kallar á `getLatestNews` og sýnir nýjustu þrjár færslur.

## Nytsamleg skipanir

| Skipun            | Lýsing                                      |
| :---------------- | :------------------------------------------- |
| `npm install`     | Setur upp öll háð                            |
| `npm run dev`     | Keyrir þróunarþjón á `http://localhost:4321` |
| `npm run build`   | Byggir framleiðsluútgáfu í `dist/`           |
| `npm run preview` | Sýnir byggða útgáfu fyrir yfirferð           |

## Tengsl við Sanity Studio

Sanity Studio verkefnið er í möppunni `../skipulagsfraedi_sanity`. Tryggðu að skema fyrir `post` innihaldi `title`, `slug`, `publishedAt` og `content` eins og skilgreint er þar. Nýjar færslur verða sjálfkrafa birtar í Astro við næstu byggingu (eða ef CDN er notað, eftir skammt). Ef þú þarft lifandi uppfærslur geturðu keyrt `SANITY_USE_CDN=false` eða endurbyggt vefinn eftir breytingar.