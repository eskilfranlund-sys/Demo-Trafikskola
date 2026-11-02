/**
 * Alla uppgifter om den fiktiva trafikskolan. Hemsidan läser härifrån, och
 * tests/site.test.ts kontrollerar att chattbotens kunskapsbas säger samma sak.
 *
 * Telefonnumren kommer ur PTS serie som är reserverad för fiktion (031-390 06 00–99),
 * så ingen riktig person blir uppringd.
 */

export const SCHOOL = {
  name: "Oscar Larssons Trafikskola",
  shortName: "Oscar Larssons",
  tagline: "Körkort med lugn, tydlighet och lokalkännedom",
  founded: 2011,
  address: { street: "Robert Macfies väg 23", postalCode: "459 30", city: "Ljungskile" },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Robert+Macfies+v%C3%A4g+23%2C+459+30+Ljungskile",
  phone: "031-390 06 40",
  phoneHref: "tel:+46313900640",
  email: "info@oscarlarssonstrafikskola.se",
  hours: {
    office: [
      { days: "Mån–tors", time: "08.00–17.00" },
      { days: "Fredag", time: "08.00–15.00" },
      { days: "Lör–sön", time: "Stängt" },
    ],
    driving: [
      { days: "Mån–tors", time: "07.00–19.00" },
      { days: "Fredag", time: "07.00–16.00" },
      { days: "Lördag", time: "09.00–14.00 (jämna veckor)" },
    ],
  },
  theoryEvening: "Tisdagar 18.00–19.30",
} as const;

export const NAV = [
  { href: "/utbildningar", label: "Utbildningar" },
  { href: "/priser", label: "Priser" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export interface Price {
  id: string;
  name: string;
  amount: number;
  unit?: string;
  note?: string;
}

/** Styckpriser. Beloppen visas på /priser och måste finnas i kunskapsbasen. */
export const PRICES: Price[] = [
  { id: "lesson", name: "Körlektion B (manuell eller automat)", amount: 720, unit: "40 min" },
  { id: "double-lesson", name: "Dubbellektion B", amount: 1390, unit: "80 min" },
  { id: "intro", name: "Introduktionsutbildning (handledarkurs)", amount: 850, unit: "per person" },
  { id: "risk1", name: "Riskettan", amount: 1900 },
  { id: "risk2", name: "Risktvåan (halkbana)", amount: 2600 },
  { id: "theory-online", name: "Teoripaket online", amount: 590, unit: "6 månader" },
  { id: "theory-evening", name: "Teorikväll", amount: 250, unit: "per tillfälle" },
  { id: "test-car", name: "Hyrbil vid uppkörning", amount: 1500, note: "Inklusive uppvärmningslektion" },
  { id: "am", name: "AM-kurs (moped klass I)", amount: 4900 },
  { id: "b96", name: "B96 (utökad B)", amount: 3900 },
  { id: "be", name: "BE-kurs (tung släpvagn)", amount: 7400 },
];

export interface Package {
  id: string;
  name: string;
  amount: number;
  summary: string;
  includes: string[];
  featured?: boolean;
}

export const PACKAGES: Package[] = [
  {
    id: "start",
    name: "Startpaket",
    amount: 6900,
    summary: "För dig som precis har börjat och vill komma igång rätt.",
    includes: ["5 körlektioner à 40 min", "Riskettan", "Teoripaket online"],
  },
  {
    id: "korkort",
    name: "Körkortspaket",
    amount: 17900,
    summary: "Allt du behöver från första lektionen till uppkörningen.",
    includes: ["15 körlektioner à 40 min", "Riskettan och Risktvåan", "Teoripaket online", "Hyrbil vid uppkörning"],
    featured: true,
  },
  {
    id: "intensiv",
    name: "Intensivpaket",
    amount: 21500,
    summary: "Körkort på tre veckor för dig som redan har övningskört en del.",
    includes: ["20 körlektioner på 3 veckor", "Riskettan och Risktvåan", "Teoripaket online", "Hyrbil vid uppkörning"],
  },
];

export interface Course {
  id: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
  icon: "car" | "bike" | "truck" | "users" | "shield" | "book";
}

export const COURSES: Course[] = [
  {
    id: "b-korkort",
    title: "B-körkort",
    short: "Personbil, manuell eller automat",
    description:
      "Vi lär dig köra säkert i allt från lugna villagator till E6:an och stadstrafik i Uddevalla. Du väljer själv om du vill köra manuell bensinbil eller automatväxlad elbil.",
    points: ["Lektioner på 40 eller 80 minuter", "Upphämtning vid Ljungskile station", "Uppkörning i Uddevalla"],
    image: "/images/wheel.jpg",
    imageAlt: "En elev håller i ratten under en körning",
    icon: "car",
  },
  {
    id: "riskutbildning",
    title: "Riskutbildning",
    short: "Riskettan och Risktvåan",
    description:
      "Riskettan handlar om alkohol, droger, trötthet och riskfyllda beteenden. Risktvåan är halkbanan, där du känner på hur bilen beter sig på hal väg. Båda måste vara klara innan uppkörningen.",
    points: ["Riskettan i våra lokaler, cirka 3,5 timmar", "Risktvåan på halkbana i Uddevalla", "Gemensam samåkning från skolan"],
    image: "/images/winter.jpg",
    imageAlt: "En bil kör på en snötäckt väg genom skogen",
    icon: "shield",
  },
  {
    id: "introduktionsutbildning",
    title: "Introduktionsutbildning",
    short: "För elev och handledare",
    description:
      "Den obligatoriska handledarkursen för dig som vill övningsköra privat. Både handledaren och eleven går kursen, gärna tillsammans.",
    points: ["En kväll, cirka 3 timmar", "Giltig i 5 år", "Tips om hur ni övar hemma"],
    image: "/images/test.jpg",
    imageAlt: "En trafiklärare med anteckningsblock pratar med en elev bredvid en bil",
    icon: "users",
  },
  {
    id: "teori",
    title: "Teori",
    short: "Online och på teorikvällar",
    description:
      "Plugga i din egen takt med vårt teoripaket online. Varje tisdagskväll går vi igenom svåra frågor tillsammans i lektionssalen.",
    points: ["Över 1 000 övningsfrågor", "Teorikväll tisdagar 18.00–19.30", "Fungerar i mobilen"],
    image: "/images/theory.jpg",
    imageAlt: "En person med hörlurar skriver anteckningar framför en laptop",
    icon: "book",
  },
  {
    id: "am-kurs",
    title: "AM-kurs",
    short: "Moped klass I från 15 år",
    description:
      "Kursen ger behörighet AM för moped klass I. Vi lånar ut moped och skyddsutrustning, så du behöver bara ta med dig själv.",
    points: ["12 timmar teori och praktik", "Moped och hjälm ingår", "Kurser under lov"],
    image: "/images/moped.jpg",
    imageAlt: "En röd moped parkerad vid en väg",
    icon: "bike",
  },
  {
    id: "be-och-b96",
    title: "BE och B96",
    short: "Släpvagn och husvagn",
    description:
      "Vill du dra en större släpvagn eller husvagn? Med B96 får ekipaget väga upp till 4 250 kg. Med BE får släpet väga upp till 3 500 kg.",
    points: ["Egen bil med släp finns att låna", "Manövrering och lastsäkring", "Vi bokar provet åt dig"],
    image: "/images/trailer.jpg",
    imageAlt: "En svart SUV med en vit husvagn på släp",
    icon: "truck",
  },
];

export interface Teacher {
  name: string;
  initials: string;
  role: string;
  since: number;
  bio: string;
  licenses: string;
}

export const TEAM: Teacher[] = [
  {
    name: "Oscar Larsson",
    initials: "OL",
    role: "Grundare och trafiklärare",
    since: 2009,
    bio: "Uppvuxen i Ljungskile och startade skolan 2011. Oscar är lugn, tydlig och har en förkärlek för nervösa nybörjare.",
    licenses: "B, BE, B96, riskutbildning",
  },
  {
    name: "Elin Berg",
    initials: "EB",
    role: "Trafiklärare och teoriansvarig",
    since: 2016,
    bio: "Elin håller i teorikvällarna och AM-kurserna. Hon gillar när svåra regler blir enkla.",
    licenses: "B, AM, teori",
  },
  {
    name: "Amir Haddad",
    initials: "AH",
    role: "Trafiklärare",
    since: 2019,
    bio: "Amir kör mest med elbilen och är vår expert på stadskörning och motorväg.",
    licenses: "B, B96, introduktionsutbildning",
  },
];

export const CARS = [
  { name: "Volkswagen ID.3", type: "Elbil, automat", count: 2 },
  { name: "Volkswagen Golf", type: "Bensin, manuell", count: 1 },
] as const;

export const FAQ = [
  {
    q: "Hur gammal måste jag vara för att börja?",
    a: "Du får övningsköra från 16 år om du har körkortstillstånd. Uppkörningen gör du tidigast när du fyllt 18.",
  },
  {
    q: "Hur många lektioner behöver jag?",
    a: "Det beror på hur mycket du övningskör hemma. De flesta av våra elever tar mellan 10 och 20 lektioner. Efter första lektionen ger vi dig en ärlig bedömning.",
  },
  {
    q: "Kan jag ta körkort på automat?",
    a: "Ja. Med automatkörkort får du bara köra automatväxlad bil. Våra elbilar är automatväxlade.",
  },
  {
    q: "Hur avbokar jag en lektion?",
    a: "Ring eller mejla senast 24 timmar innan. Avbokar du senare debiteras lektionen, om du inte har ett läkarintyg.",
  },
  {
    q: "Kan jag betala med Swish eller delbetala?",
    a: "Du kan betala med Swish, kort eller faktura. Körkortspaketet och Intensivpaketet kan delbetalas på upp till 12 månader.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "Jag var jättenervös inför första lektionen, men Oscar fick mig att slappna av direkt. Klarade uppkörningen på första försöket.",
    name: "Moa, 18",
  },
  {
    quote: "Bra att kunna öva på E6:an och i Uddevalla. Uppkörningen kändes som en vanlig lektion.",
    name: "Liam, 19",
  },
  {
    quote: "Teorikvällarna med Elin var guld värda. Äntligen förstod jag högerregeln.",
    name: "Sara, 24",
  },
];

/** Bilder från Unsplash (fri licens). Visas på /om-oss#bilder. */
export const PHOTO_CREDITS = [
  { file: "wheel.jpg", photographer: "Andraz Lazic", url: "https://unsplash.com/photos/woman-driving-car-lcirqLKB8B4" },
  { file: "winter.jpg", photographer: "Shashidhar S", url: "https://unsplash.com/photos/a-car-driving-down-a-snow-covered-road-CM4pL5ftpWc" },
  { file: "test.jpg", photographer: "Bas Peperzak", url: "https://unsplash.com/photos/driving-test-instructor-and-student-tyhpK_QelPo" },
  { file: "theory.jpg", photographer: "Soundtrap", url: "https://unsplash.com/photos/person-writing-in-notebook-at-home-office-ddwbTn5HDdQ" },
  { file: "moped.jpg", photographer: "Anastasiia Tarasova", url: "https://unsplash.com/photos/red-vespa-motor-scooter-on-side-of-the-road-wlQDgb79UAk" },
  { file: "trailer.jpg", photographer: "Benjamin Zanatta", url: "https://unsplash.com/photos/black-suv-and-white-trailer-CfhtS2nj95c" },
  { file: "road.jpg", photographer: "Daniel Moqvist", url: "https://unsplash.com/photos/gray-concrete-road-between-green-trees-under-white-clouds-and-blue-sky-during-daytime-F2MJRGvRNxY" },
  { file: "ev.jpg", photographer: "CHUTTERSNAP", url: "https://unsplash.com/photos/electric-vehicle-charging-cable-plugged-into-car-xJLsHl0hIik" },
  { file: "keys.jpg", photographer: "Erik Mclean", url: "https://unsplash.com/photos/focus-photography-of-black-vehicle-key-dVEO6g0yej0" },
] as const;

/** "17900" → "17 900 kr" med hårt mellanslag, som på svenska prislappar. */
export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat("sv-SE").format(amount).replace(/\s/g, "\u00a0")}\u00a0kr`;
}
