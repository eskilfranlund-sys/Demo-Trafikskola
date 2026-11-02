import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import { CARS, PHOTO_CREDITS, SCHOOL, TEAM } from "@/lib/school";

export const metadata: Metadata = {
  title: "Om oss",
  description: "Möt trafiklärarna på Oscar Larssons Trafikskola i Ljungskile och se våra bilar.",
};

const VALUES = [
  { icon: "users" as const, title: "Samma lärare hela vägen", text: "Du slipper börja om varje gång. Din lärare vet var du är och vad du behöver öva på." },
  { icon: "route" as const, title: "Riktiga vägar", text: "Vi kör där du kommer att köra: landsväg, motorväg, stadstrafik och uppkörningsområdet." },
  { icon: "shield" as const, title: "Ärliga besked", text: "Vi säger när du är redo för provet, och inte förrän dess. Det sparar både pengar och nerver." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Om oss"
        title="En liten skola med lång erfarenhet"
        lead={`Oscar Larsson startade trafikskolan i ${SCHOOL.address.city} ${SCHOOL.founded}. I dag är vi tre trafiklärare som har hjälpt flera tusen elever till körkortet.`}
      />

      <section className="section" aria-labelledby="historia-rubrik">
        <div className="container split">
          <div className="prose">
            <p className="eyebrow">Vår historia</p>
            <h2 id="historia-rubrik">Från en bil till tre</h2>
            <p>
              Efter några år som trafiklärare i Göteborg ville Oscar tillbaka till hemorten. Han startade skolan med en
              enda bil och ett kontor i källaren. Eleverna kom via grannar och klasskompisar, och så har det fortsatt.
            </p>
            <p>
              Vi är fortfarande en liten skola, och det är medvetet. Du får lära känna din lärare, och vi hinner lära
              känna dig.
            </p>
          </div>
          <div className="split-media">
            <Image
              src="/images/test.jpg"
              alt="En trafiklärare med anteckningsblock pratar med en elev bredvid en bil"
              fill
              preload
              sizes="(min-width: 900px) 560px, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="larare-rubrik">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Trafiklärarna</p>
            <h2 id="larare-rubrik">Möt oss som kör med dig</h2>
          </div>
          <div className="grid-3">
            {TEAM.map((t) => (
              <article key={t.name} className="team-card" aria-labelledby={`larare-${t.initials}`}>
                <span className="avatar" aria-hidden="true">
                  {t.initials}
                </span>
                <h3 id={`larare-${t.initials}`}>{t.name}</h3>
                <p className="team-role">{t.role}</p>
                <p>{t.bio}</p>
                <span className="tag">Trafiklärare sedan {t.since}</span>
                <span className="tag">Behörigheter: {t.licenses}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="varderingar-rubrik">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Så jobbar vi</p>
            <h2 id="varderingar-rubrik">Det här kan du räkna med</h2>
          </div>
          <div className="grid-3">
            {VALUES.map((v) => (
              <div key={v.title} className="team-card">
                <span className="icon-badge" aria-hidden="true">
                  <Icon name={v.icon} size={22} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="bilar-rubrik">
        <div className="container split">
          <div className="split-media">
            <Image
              src="/images/ev.jpg"
              alt="En laddkabel sitter i laddporten på en elbil"
              fill
              sizes="(min-width: 900px) 560px, 100vw"
            />
          </div>
          <div className="prose">
            <p className="eyebrow">Våra bilar</p>
            <h2 id="bilar-rubrik">Elbil eller manuell, du väljer</h2>
            <p>Alla bilar har dubbelkommando, backkamera och vinterdäck på vintern.</p>
            <ul className="check-list">
              {CARS.map((c) => (
                <li key={c.name}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>
                      {c.count} × {c.name}
                    </strong>{" "}
                    – {c.type}
                  </span>
                </li>
              ))}
              <li>
                <Icon name="check" size={18} />
                <span>
                  <strong>Bil med släp</strong> – för BE och B96
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="bilder" className="section" aria-labelledby="bilder-rubrik">
        <div className="container prose">
          <h2 id="bilder-rubrik" style={{ fontSize: "1.5rem" }}>
            Om sidan och bilderna
          </h2>
          <p>
            {SCHOOL.name} är en påhittad trafikskola. Namn, personal, priser och kontaktuppgifter är fiktiva, och
            telefonnumren kommer ur den nummerserie som Post- och telestyrelsen reserverat för fiktion. Fotona kommer
            från Unsplash och används enligt Unsplash-licensen:
          </p>
          <ul className="credits">
            {PHOTO_CREDITS.map((c) => (
              <li key={c.file}>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  Foto av {c.photographer}
                  <span className="visually-hidden"> (öppnas i ny flik)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
