import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="breadcrumb" aria-label="Brödsmulor">
          <ol>
            <li>
              <Link href="/">Start</Link>
            </li>
            <li aria-current="page">{eyebrow}</li>
          </ol>
        </nav>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </section>
  );
}
