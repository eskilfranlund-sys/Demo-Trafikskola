# Oscar Larssons Trafikskola – hemsida med AI-chattassistent

Ett portfolioprojekt i webbdesign: hemsidan för en **påhittad** trafikskola i Ljungskile, med en chattassistent byggd på Claude API. Namn, personal, priser och kontaktuppgifter är fiktiva. Telefonnumren kommer ur PTS serie för fiktion (031-390 06 00–99). Formulären skickar ingenting.

Byggt med Next.js 16 (App Router), TypeScript och CSS utan ramverk.

## Kom igång

```bash
npm install
cp .env.example .env.local   # fyll i ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Utan API-nyckel fungerar hela hemsidan. Bara chattens svar från Claude uteblir (servern svarar 503 och widgeten visar ett felmeddelande).

## Sidor

| Sökväg | Innehåll |
|---|---|
| `/` | Hero, utbildningar, steg till körkortet, paket, lokalkännedom, elevröster |
| `/utbildningar` | B, riskutbildning, introduktionsutbildning, teori, AM, BE/B96 (med ankarlänkar) |
| `/priser` | Paket och prislista |
| `/om-oss` | Historia, trafiklärare, bilar, bildkrediter (`#bilder`) |
| `/kontakt` | Kontaktuppgifter, öppettider, kontaktformulär, vanliga frågor (`#vanliga-fragor`) |
| `/boka` | Bokningsförfrågan. `?utbildning=korkort` väljer i förväg |

## Var saker finns

- **`src/lib/school.ts`**: all skoldata (namn, adress, priser, paket, utbildningar, personal). Hemsidan läser härifrån.
- **`src/data/traffic-school-knowledge.json`**: chattbotens kunskapsbas. `tests/site.test.ts` kontrollerar att priser och kontaktuppgifter stämmer med `school.ts`, så ändra på båda ställena.
- **`src/app/globals.css`**: designtokens (färger för ljust och mörkt läge, avstånd, radier) och alla komponentstilar.
- **`src/components/`**: sidhuvud, sidfot, ikoner (Lucide-stil, inlinade), formulär och chattwidgeten.
- **`public/images/`**: foton från [Unsplash](https://unsplash.com/license). Fotograferna krediteras på `/om-oss#bilder`.
- **`archive/jj-trafikskola/`**: den tidigare kunskapsbasen och researchen för J&J:s Trafikskola. Den används inte av appen.

## Så fungerar chatten

1. Besökaren skriver i chattfönstret (`src/components/ChatWidget.tsx`), som anropar `POST /api/chat`.
2. Routen (`src/app/api/chat/route.ts`) begränsar antalet anrop per IP-adress och validerar indata.
3. `src/lib/chat.ts` stoppar personnummer, lösenord och kortnummer **innan** något skickas till Claude.
4. `src/lib/knowledge.ts` väljer ut högst 5 relevanta poster plus kontaktuppgifterna. Poster med passerat `valid_until` tas bort.
5. Claude (`claude-opus-5-5`, se `src/lib/anthropic.ts`) svarar utifrån utdraget och länkar till hemsidans sidor (`/priser`, `/boka` och så vidare), som widgeten gör klickbara.
6. `src/lib/guardrails.ts` kontrollerar svaret. Påhittade priser, okända datum och påståenden om att något är bokat ersätts av ett säkert standardsvar.

API-nyckeln finns bara på servern (`server-only`).

## Publicera på Vercel

1. Lägg projektet i ett GitHub-repo (`.env.local` checkas inte in tack vare `.gitignore`).
2. Logga in på [vercel.com](https://vercel.com), välj **Add New → Project** och importera repot. Vercel känner igen Next.js automatiskt.
3. Under **Environment Variables**: lägg till `ANTHROPIC_API_KEY` med din nyckel.
4. Klicka **Deploy**. Efter en ny miljövariabel behöver du göra **Redeploy**.

Tips: sätt en månadsgräns för API-kostnaden i Anthropic Console, eftersom sidan är publik. Anropsbegränsningen i `src/lib/rate-limit.ts` ligger i minnet och gäller per serverinstans, så den skyddar inte fullt ut på Vercel.

Sidan har `noindex`, så att den fiktiva skolan inte dyker upp i sökresultat som ett riktigt företag.

## Tester

| Kommando | Vad |
|---|---|
| `npm test` | Alla offline-tester (kunskapsbas, sökning, skydd, chattflöde, säkerhet, att hemsida och bot säger samma sak) |
| `npm run test:links` | Kontrollerar externa länkar, till exempel bildkrediterna (nätverk) |
| `npm run test:live` | Riktiga frågor till Claude API. Kräver `ANTHROPIC_API_KEY` och kostar pengar |
| `npm run validate:knowledge` | Validerar JSON-filen |
| `npm run build && npm run check:bundle` | Säkerställer att nyckeln och AI-klienten inte finns i webbläsarkoden |
