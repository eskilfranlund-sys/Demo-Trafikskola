import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import { COURSES, formatPrice, PRICES } from "@/lib/school";

export const metadata: Metadata = {
  title: "Utbildningar",
  description: "B-körkort, riskutbildning, introduktionsutbildning, teori, AM-kurs samt BE och B96 i Ljungskile.",
};

const COURSE_PRICES: Record<string, string[]> = {
  "b-korkort": ["lesson"],
  riskutbildning: ["risk1", "risk2"],
  introduktionsutbildning: ["intro"],
  teori: ["theory-online", "theory-evening"],
  "am-kurs": ["am"],
  "be-och-b96": ["b96", "be"],
};

function priceLine(courseId: string): string {
  return (COURSE_PRICES[courseId] ?? [])
    .map((id) => PRICES.find((p) => p.id === id)!)
    .map((p) => `${p.name}: ${formatPrice(p.amount)}${p.unit ? ` (${p.unit})` : ""}`)
    .join(" · ");
}

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Utbildningar"
        title="Utbildningar för alla steg"
        lead="Oavsett om du ska börja övningsköra, köra moped eller dra husvagn hittar du rätt utbildning här."
      >
        <ul className="course-nav" aria-label="Hoppa till utbildning">
          {COURSES.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="chip-link">
                <Icon name={c.icon} size={18} />
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="container">
        {COURSES.map((c, i) => (
          <section key={c.id} id={c.id} className="course" aria-labelledby={`${c.id}-rubrik`}>
            <div className="course-media">
              <Image
                src={c.image}
                alt={c.imageAlt}
                fill
                preload={i === 0}
                sizes="(min-width: 900px) 540px, 100vw"
              />
            </div>
            <div className="course-copy">
              <span className="icon-badge" aria-hidden="true">
                <Icon name={c.icon} size={22} />
              </span>
              <p className="eyebrow">{c.short}</p>
              <h2 id={`${c.id}-rubrik`}>{c.title}</h2>
              <p>{c.description}</p>
              <ul className="check-list">
                {c.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" size={18} />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="course-price">{priceLine(c.id)}</p>
              <div className="btn-row">
                <Link href={`/boka?utbildning=${c.id}`} className="btn btn-dark">
                  Skicka förfrågan
                  <span className="visually-hidden"> om {c.title}</span>
                </Link>
                <Link href="/priser" className="btn btn-secondary">
                  Alla priser
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CtaBand title="Osäker på vad du behöver?" />
    </>
  );
}
