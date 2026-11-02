import Link from "next/link";
import { COURSES, NAV, SCHOOL } from "@/lib/school";
import { Logo } from "./SiteHeader";

export default function SiteFooter() {
  const { address } = SCHOOL;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="prose">
            <Logo />
            <p>{SCHOOL.tagline}. Körskola i {address.city} sedan {SCHOOL.founded}.</p>
          </div>

          <nav aria-labelledby="sidfot-sidor">
            <h2 id="sidfot-sidor">Sidor</h2>
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/boka">Boka lektion</Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="sidfot-utbildningar">
            <h2 id="sidfot-utbildningar">Utbildningar</h2>
            <ul>
              {COURSES.map((c) => (
                <li key={c.id}>
                  <Link href={`/utbildningar#${c.id}`}>{c.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2>Kontakt</h2>
            <ul>
              <li>
                <a href={SCHOOL.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}
                  <span className="visually-hidden"> (öppnas i Google Maps i ny flik)</span>
                </a>
              </li>
              <li>
                <a href={SCHOOL.phoneHref}>{SCHOOL.phone}</a>
              </li>
              <li>
                <a href={`mailto:${SCHOOL.email}`}>{SCHOOL.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {SCHOOL.name}. En fiktiv trafikskola, skapad som portfolioprojekt.
          </p>
          <p>
            Foton från <Link href="/om-oss#bilder">Unsplash</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
