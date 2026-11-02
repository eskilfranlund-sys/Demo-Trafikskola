import Link from "next/link";
import { formatPrice, PACKAGES } from "@/lib/school";
import Icon from "./Icon";

export default function PackageCards({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className="packages">
      {PACKAGES.map((p) => (
        <article key={p.id} className={`package${p.featured ? " featured" : ""}`} aria-labelledby={`paket-${p.id}`}>
          {p.featured && <span className="package-badge">Populärast</span>}
          <Heading id={`paket-${p.id}`}>{p.name}</Heading>
          <p>{p.summary}</p>
          <p className="price">{formatPrice(p.amount)}</p>
          <ul className="check-list">
            {p.includes.map((item) => (
              <li key={item}>
                <Icon name="check" size={18} />
                {item}
              </li>
            ))}
          </ul>
          <Link href={`/boka?utbildning=${p.id}`} className={`btn ${p.featured ? "btn-primary" : "btn-secondary"}`}>
            Välj {p.name.toLowerCase()}
            <span className="visually-hidden">, {formatPrice(p.amount)}</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
