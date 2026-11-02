import Image from "next/image";
import Link from "next/link";
import { SCHOOL } from "@/lib/school";
import Icon from "./Icon";

export default function CtaBand({ title = "Redo att sätta dig bakom ratten?" }: { title?: string }) {
  return (
    <section className="section" aria-labelledby="cta-rubrik">
      <div className="container">
        <div className="cta-band">
          <Image src="/images/keys.jpg" alt="" fill sizes="(min-width: 1180px) 1140px, 100vw" />
          <h2 id="cta-rubrik">{title}</h2>
          <p>
            Skicka en bokningsförfrågan, så ringer vi upp inom en arbetsdag. Du kan också ringa oss direkt på{" "}
            {SCHOOL.phone}.
          </p>
          <div className="btn-row">
            <Link href="/boka" className="btn btn-primary">
              Boka lektion
              <Icon name="arrowRight" size={18} />
            </Link>
            <a href={SCHOOL.phoneHref} className="btn btn-secondary">
              <Icon name="phone" size={18} />
              Ring {SCHOOL.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
