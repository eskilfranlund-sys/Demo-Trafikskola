import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import MapIllustration from "@/components/MapIllustration";
import PageHero from "@/components/PageHero";
import { FAQ, SCHOOL } from "@/lib/school";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakta Oscar Larssons Trafikskola i Ljungskile. Adress, telefon, öppettider och vanliga frågor.",
};

export default function ContactPage() {
  const { address } = SCHOOL;
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Hör av dig"
        lead="Ring, mejla eller skicka ett meddelande. Vi svarar inom en arbetsdag. Du kan också fråga chattassistenten nere till höger."
      />

      <section className="section" aria-label="Kontaktuppgifter och formulär">
        <div className="container contact-grid">
          <div style={{ display: "grid", gap: "var(--space-5)", alignContent: "start" }}>
            <div className="panel">
              <ul className="info-list">
                <li>
                  <span className="icon-badge" aria-hidden="true">
                    <Icon name="mapPin" />
                  </span>
                  <div>
                    <strong>Besöksadress</strong>
                    {address.street}, {address.postalCode} {address.city}
                    <br />
                    <a href={SCHOOL.mapsUrl} target="_blank" rel="noopener noreferrer">
                      Öppna i Google Maps
                      <span className="visually-hidden"> (öppnas i ny flik)</span>
                    </a>
                  </div>
                </li>
                <li>
                  <span className="icon-badge" aria-hidden="true">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <strong>Telefon</strong>
                    <a href={SCHOOL.phoneHref}>{SCHOOL.phone}</a>
                  </div>
                </li>
                <li>
                  <span className="icon-badge" aria-hidden="true">
                    <Icon name="mail" />
                  </span>
                  <div>
                    <strong>E-post</strong>
                    <a href={`mailto:${SCHOOL.email}`} style={{ overflowWrap: "anywhere" }}>
                      {SCHOOL.email}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="panel">
              <div className="grid-2" style={{ gap: "var(--space-5)" }}>
                <div>
                  <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Kontoret</h2>
                  <dl className="hours">
                    {SCHOOL.hours.office.map((h) => (
                      <div key={h.days} style={{ display: "contents" }}>
                        <dt>{h.days}</dt>
                        <dd>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Körtider</h2>
                  <dl className="hours">
                    {SCHOOL.hours.driving.map((h) => (
                      <div key={h.days} style={{ display: "contents" }}>
                        <dt>{h.days}</dt>
                        <dd>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <div className="map-card">
              <MapIllustration />
              <div className="float-card">
                <span className="icon-badge accent" aria-hidden="true">
                  <Icon name="mapPin" />
                </span>
                <div>
                  <strong>5 minuter från Ljungskile station</strong>
                  <a
                    href={SCHOOL.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visa vägen i Google Maps
                    <span className="visually-hidden"> (öppnas i ny flik)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <ContactForm />
          </div>
        </div>
      </section>

      <section id="vanliga-fragor" className="section section-alt" aria-labelledby="faq-rubrik">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Vanliga frågor</p>
            <h2 id="faq-rubrik">Svar på det mesta</h2>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <Icon name="chevronDown" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
