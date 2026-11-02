import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import PackageCards from "@/components/PackageCards";
import { COURSES, formatPrice, PACKAGES, SCHOOL, TESTIMONIALS } from "@/lib/school";

const HERO_POINTS = ["Elbil eller manuell bil", "Upphämtning vid stationen", "Kvälls- och lördagstider", "Uppkörning i Uddevalla"];

const STEPS = [
  {
    title: "Skaffa körkortstillstånd",
    text: "Ansök hos Transportstyrelsen och gör synundersökningen. Det tar ofta några veckor, så börja i god tid.",
  },
  {
    title: "Kör lektioner och plugga teori",
    text: "Vi lägger upp en plan efter din nivå. Kombinera lektioner med teoripaketet och övningskörning hemma.",
  },
  {
    title: "Riskutbildning och uppkörning",
    text: "Gör Riskettan och halkbanan med oss. När du är redo bokar vi provet och lånar ut bilen.",
  },
];

export default function Home() {
  const featured = PACKAGES.find((p) => p.featured)!;
  const yearsActive = new Date().getFullYear() - SCHOOL.founded;

  return (
    <>
      <section className="hero" aria-labelledby="hero-rubrik">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trafikskola i {SCHOOL.address.city} sedan {SCHOOL.founded}</p>
            <h1 id="hero-rubrik">
              Ta körkortet med <em>lugn och trygghet</em>
            </h1>
            <p className="lead">
              Vi är en liten trafikskola med stora krav på oss själva. Hos oss får du samma trafiklärare genom hela
              utbildningen och övar på riktiga vägar: villagator, landsväg, E6:an och stadstrafik i Uddevalla.
            </p>
            <div className="btn-row">
              <Link href="/boka" className="btn btn-primary">
                Boka lektion
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link href="/priser" className="btn btn-secondary">
                Se priser och paket
              </Link>
            </div>
            <ul className="hero-points">
              {HERO_POINTS.map((p) => (
                <li key={p}>
                  <Icon name="check" size={18} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-media">
            <div className="hero-photo">
              <Image
                src="/images/wheel.jpg"
                alt="En elev håller i ratten med båda händerna under en körlektion"
                fill
                preload
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <div className="float-card top">
              <span className="icon-badge" aria-hidden="true">
                <Icon name="calendar" />
              </span>
              <div>
                <strong>Teorikväll</strong>
                <span>{SCHOOL.theoryEvening}</span>
              </div>
            </div>
            <div className="float-card bottom">
              <span className="icon-badge accent" aria-hidden="true">
                <Icon name="award" />
              </span>
              <div>
                <strong>
                  {featured.name} {formatPrice(featured.amount)}
                </strong>
                <span>Lektioner, riskutbildning och hyrbil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Snabbfakta" style={{ paddingTop: 0 }}>
        <div className="container">
          <dl className="stats">
            <div className="stat">
              <dt>år i {SCHOOL.address.city}</dt>
              <dd>{yearsActive}</dd>
            </div>
            <div className="stat">
              <dt>trafiklärare</dt>
              <dd>3</dd>
            </div>
            <div className="stat">
              <dt>elbilar med automat</dt>
              <dd>2</dd>
            </div>
            <div className="stat">
              <dt>dagar i veckan med körtider</dt>
              <dd>6</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="utbildningar-rubrik">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Utbildningar</p>
            <h2 id="utbildningar-rubrik">Från moped till husvagn</h2>
            <p className="lead">Välj det körkort du vill ta. Vi hjälper dig hela vägen fram till provet.</p>
          </div>
          <div className="grid-3">
            {COURSES.map((c) => (
              <Link key={c.id} href={`/utbildningar#${c.id}`} className="card card-link">
                <div className="card-media">
                  <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="card-body">
                  <span className="card-kicker">{c.short}</span>
                  <h3>{c.title}</h3>
                  <p>{c.description.split(/(?<=[.?!])\s/)[0]}</p>
                  <span className="text-link">
                    Läs mer
                    <Icon name="arrowRight" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="steg-rubrik">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Så går det till</p>
            <h2 id="steg-rubrik">Tre steg till ditt B-körkort</h2>
          </div>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.title} className="step">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="paket-rubrik">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Paket</p>
            <h2 id="paket-rubrik">Tydliga priser utan överraskningar</h2>
            <p className="lead">
              Alla paket kan kompletteras med fler lektioner. <Link href="/priser">Se alla priser</Link>.
            </p>
          </div>
          <PackageCards />
        </div>
      </section>

      <section className="section" aria-labelledby="lokalt-rubrik">
        <div className="container split">
          <div className="split-media">
            <Image
              src="/images/road.jpg"
              alt="En landsväg med vit mittlinje mellan skog och ängar, med ett rött hus vid vägkanten"
              fill
              sizes="(min-width: 900px) 560px, 100vw"
            />
          </div>
          <div className="prose">
            <p className="eyebrow">Lokalkännedom</p>
            <h2 id="lokalt-rubrik">Vi kör där du ska köra</h2>
            <p>
              Ljungskile har lugna gator där du kan öva i din egen takt. Efter några lektioner kör vi ut på E6:an och in
              till Uddevalla, där uppkörningen görs. Du lär dig rondellerna, cykelfälten och busskörfälten innan provet.
            </p>
            <p>
              Vi hämtar gärna upp dig vid Ljungskile station, så att du kan ta tåget direkt från skolan i Uddevalla.
            </p>
            <Link href="/om-oss" className="text-link">
              Möt trafiklärarna
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="omdomen-rubrik">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Elever berättar</p>
            <h2 id="omdomen-rubrik">Vad eleverna säger</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="quote">
                <span className="quote-mark">
                  <Icon name="quote" size={28} />
                </span>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
