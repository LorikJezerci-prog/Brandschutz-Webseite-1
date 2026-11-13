import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrelaunchBar } from "@/components/PrelaunchBar";
import { SiteRuntime } from "@/components/SiteRuntime";
import { ToTop } from "@/components/ToTop";
import { site } from "@/config/site";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/sections.css";

// Schriften werden beim Build lokal eingebunden; im Browser gibt es keine Verbindung zu Google.
const sans = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Brandschutz im Hessischen Ried und an der Bergstraße`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: site.name,
    title: `${site.name} · Brandschutz beginnt, bevor etwas passiert.`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0A6B44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={sans.variable} suppressHydrationWarning>
      <body>
        <PrelaunchBar />
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
        <ToTop />
        <SiteRuntime />
      </body>
    </html>
  );
}
