import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import PackageCards from "@/components/PackageCards";
import PageHero from "@/components/PageHero";
import { formatPrice, PRICES } from "@/lib/school";

export const metadata: Metadata = {
  title: "Priser och paket",
  description: "Priser för körlektioner, paket, riskutbildning, AM-kurs och BE hos Oscar Larssons Trafikskola.",
};

export default function PricesPage() {
  return (
    <>
      <PageHero
        eyebrow="Priser"
        title="Priser och paket"
        lead="Alla priser är inklusive moms. Paketen är billigare än att köpa allt styckvis, och du kan alltid lägga till fler lektioner."
      />

      <section className="section" aria-labelledby="paket-rubrik">
        <div className="container">
          <div className="section-head">
            <h2 id="paket-rubrik">Paket för B-körkort</h2>
            <p className="lead">Körkortspaketet och Intensivpaketet kan delbetalas på upp till 12 månader.</p>
          </div>
          <PackageCards />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="styckpriser">
        <div className="container grid-2" style={{ alignItems: "start" }}>
          <div className="prose">
            <p className="eyebrow">Styckpriser</p>
            <h2 id="styckpriser">Lektioner och kurser</h2>
            <p>
              Lektionspriset är detsamma för manuell bil och automat. Avboka senast 24 timmar innan, annars debiteras
              lektionen.
            </p>
            <div className="note">
              <Icon name="info" />
              <p>
                Avgifterna för kunskapsprov och körprov ingår inte. De betalar du direkt till Trafikverket när provet
                bokas.
              </p>
            </div>
            <Link href="/kontakt#vanliga-fragor" className="text-link">
              Frågor om betalning och avbokning
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          <div className="table-wrap">
            <table className="price-table">
              <caption className="visually-hidden">Styckpriser</caption>
              <thead>
                <tr>
                  <th scope="col">Tjänst</th>
                  <th scope="col">Pris</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.id}>
                    <th scope="row" style={{ fontWeight: 500 }}>
                      {p.name}
                      {(p.unit || p.note) && <span className="unit">{[p.unit, p.note].filter(Boolean).join(" · ")}</span>}
                    </th>
                    <td>{formatPrice(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
