import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container prose" style={{ justifyItems: "start" }}>
        <p className="eyebrow">Fel 404</p>
        <h1>Här tog vägen slut</h1>
        <p>Sidan du letar efter finns inte. Den kan ha flyttats eller så är adressen felstavad.</p>
        <div className="btn-row">
          <Link href="/" className="btn btn-primary">
            Till startsidan
          </Link>
          <Link href="/kontakt" className="btn btn-secondary">
            Kontakta oss
          </Link>
        </div>
      </div>
    </section>
  );
}
