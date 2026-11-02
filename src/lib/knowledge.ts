import rawEntries from "@/data/traffic-school-knowledge.json";

export interface KnowledgeEntry {
  id: string;
  category: string;
  question_variants: string[];
  answer: string;
  source_url: string;
  last_checked: string;
  needs_review: boolean;
  review_note?: string;
  /** Sista dag (inklusive) som posten får visas, t.ex. för annonserade kursdatum. */
  valid_until?: string;
}

export const allEntries: readonly KnowledgeEntry[] = rawEntries as KnowledgeEntry[];

/** Posten som alltid skickas med så att boten kan hänvisa vidare. */
export const CONTACT_ENTRY_ID = "contact-info";

/** Dagens datum i svensk tid, som "ÅÅÅÅ-MM-DD". */
export function swedishDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(date);
}

export function isActive(entry: KnowledgeEntry, today: Date = new Date()): boolean {
  return !entry.valid_until || entry.valid_until >= swedishDate(today);
}

export function activeEntries(today: Date = new Date()): KnowledgeEntry[] {
  return allEntries.filter((e) => isActive(e, today));
}

const STOPWORDS = new Set(
  ("och att det som en ett är jag du ni vi man hur vad var när kan får för med på i av till om har " +
    "den de mig dig er oss min din mitt ditt mina dina sig så ska skulle vill hos från eller inte " +
    "också bara mycket många någon något några finns gör göra hej tack snälla era ert vilken vilket vilka").split(" "),
);

const SUFFIXES = ["arna", "erna", "orna", "ande", "ende", "en", "et", "er", "ar", "or", "na", "s"];

function stem(word: string): string {
  for (const suffix of SUFFIXES) {
    if (word.length - suffix.length >= 4 && word.endsWith(suffix)) return word.slice(0, -suffix.length);
  }
  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zåäöé0-9]+/g, " ")
    .split(" ")
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

interface IndexedEntry {
  entry: KnowledgeEntry;
  questionText: string;
  fullText: string;
}

const indexCache = new Map<string, IndexedEntry>();

function index(entry: KnowledgeEntry): IndexedEntry {
  const cached = indexCache.get(entry.id);
  if (cached) return cached;
  const questionText = tokenize([entry.id.replace(/-/g, " "), entry.category, ...entry.question_variants].join(" ")).join(" ");
  const indexed = { entry, questionText, fullText: `${questionText} ${tokenize(entry.answer).join(" ")}` };
  indexCache.set(entry.id, indexed);
  return indexed;
}

/**
 * Enkel nyckelordssökning. Delsträngsmatchning gör att sammansatta ord fungerar
 * ("körlektionspris" träffar "körlektion").
 */
export function scoreEntry(queryTokens: string[], item: IndexedEntry): number {
  let score = 0;
  for (const token of new Set(queryTokens)) {
    // Korta ord måste matcha ett helt ord, annars ger "era" träff i "generell".
    const matches = (text: string) => (token.length >= 4 ? text.includes(token) : ` ${text} `.includes(` ${token} `));
    if (matches(item.questionText)) score += 3;
    else if (matches(item.fullText)) score += 1;
  }
  return score;
}

export interface RetrievalResult {
  entries: KnowledgeEntry[];
  /** Högsta poängen – låg poäng betyder att kunskapsbasen troligen saknar svar. */
  topScore: number;
}

export const MIN_RELEVANT_SCORE = 3;

export function retrieve(query: string, options: { today?: Date; limit?: number } = {}): RetrievalResult {
  const { today = new Date(), limit = 5 } = options;
  const entries = activeEntries(today);
  const queryTokens = tokenize(query);
  const ranked = entries
    .map((entry) => ({ entry, score: scoreEntry(queryTokens, index(entry)) }))
    .filter((r) => r.score >= MIN_RELEVANT_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const selected = ranked.map((r) => r.entry);
  const contact = entries.find((e) => e.id === CONTACT_ENTRY_ID);
  if (contact && !selected.includes(contact)) selected.push(contact);

  return { entries: selected, topScore: ranked[0]?.score ?? 0 };
}

/** Alla belopp ("675 kr", "10 500 kr") som förekommer i aktiva poster. */
export function knownAmounts(today: Date = new Date()): Set<number> {
  const amounts = new Set<number>();
  for (const e of activeEntries(today)) for (const n of extractAmounts(e.answer)) amounts.add(n);
  return amounts;
}

export function extractAmounts(text: string): number[] {
  return [...text.matchAll(/(\d{1,3}(?:[  ]\d{3})+|\d+)\s*(?:kr|kronor|sek)\b/gi)].map((m) =>
    Number(m[1].replace(/[  ]/g, "")),
  );
}
