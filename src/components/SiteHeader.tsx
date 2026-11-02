"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { NAV, SCHOOL } from "@/lib/school";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${SCHOOL.name}, till startsidan`}>
      <span className="logo-mark" aria-hidden="true">
        OL
      </span>
      <span className="logo-text">
        <strong>{SCHOOL.shortName}</strong>
        <span>Trafikskola · {SCHOOL.address.city}</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Stäng mobilmenyn när besökaren byter sida.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav className="main-nav" aria-label="Huvudmeny">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/boka" className="btn btn-primary header-cta">
            Boka lektion
          </Link>
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobilmeny"
            aria-label={open ? "Stäng menyn" : "Öppna menyn"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobilmeny" className="mobile-nav" aria-label="Mobilmeny">
          <div className="container">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/boka" className="btn btn-primary">
                  Boka lektion
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
