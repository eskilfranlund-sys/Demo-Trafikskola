import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import ChatWidget from "@/components/ChatWidget";
import Icon from "@/components/Icon";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SCHOOL } from "@/lib/school";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${SCHOOL.name} – körkort i ${SCHOOL.address.city}`, template: `%s | ${SCHOOL.name}` },
  description: `${SCHOOL.name} i ${SCHOOL.address.city}: B-körkort, riskutbildning, handledarkurs, AM och BE. Ett fiktivt portfolioprojekt.`,
  // Fiktiv skola – ska inte dyka upp i sökresultat som ett riktigt företag.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111d2c" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <a href="#innehall" className="skip-link">
          Hoppa till innehållet
        </a>
        <div className="demo-banner" role="note">
          <div className="container">
            <Icon name="info" size={18} />
            <p>
              <strong>Demo:</strong> {SCHOOL.name} är påhittad. Sidan är ett portfolioprojekt i webbdesign, och inga
              bokningar skickas.
            </p>
          </div>
        </div>
        <SiteHeader />
        <main id="innehall" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
