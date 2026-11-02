import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import { SCHOOL } from "@/lib/school";

export const metadata: Metadata = {
  title: "Boka",
  description: "Skicka en bokningsförfrågan till Oscar Larssons Trafikskola, så ringer vi upp och föreslår en tid.",
};

const NEXT = [
  { icon: "phone" as const, text: "Vi ringer upp inom en arbetsdag och föreslår en tid." },
  { icon: "calendar" as const, text: "Du får en bekräftelse på sms och mejl." },
  { icon: "car" as const, text: "Vi ses vid skolan eller vid Ljungskile station." },
];

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ utbildning?: string | string[] }> }) {
  const { utbildning } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Boka"
        title="Skicka en bokningsförfrågan"
        lead="Berätta vad du vill boka och när det passar, så hör vi av oss. Det är inte bindande."
      />
      <section className="section">
        <div className="container contact-grid" style={{ gridTemplateColumns: undefined }}>
          <aside className="panel" aria-labelledby="sa-funkar-det" style={{ alignSelf: "start" }}>
            <h2 id="sa-funkar-det" style={{ fontSize: "1.25rem" }}>
              Så funkar det
            </h2>
            <ul className="info-list">
              {NEXT.map((n) => (
                <li key={n.text}>
                  <span className="icon-badge" aria-hidden="true">
                    <Icon name={n.icon} />
                  </span>
                  <p style={{ paddingTop: 10 }}>{n.text}</p>
                </li>
              ))}
            </ul>
            <p className="hint">
              Hellre ringa? <a href={SCHOOL.phoneHref}>{SCHOOL.phone}</a>
            </p>
          </aside>
          <div className="panel">
            <BookingForm initial={typeof utbildning === "string" ? utbildning : undefined} />
          </div>
        </div>
      </section>
    </>
  );
}
