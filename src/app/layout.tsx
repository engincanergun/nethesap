import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";
import { Analytics } from "@/components/Analytics";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NetHesap — Bordro artık net.",
  description: "Türkiye 2026 bordro hesaplama: net, brüt, işveren maliyeti ve detaylı kırılım.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: "NetHesap — Bordro artık net.",
    description: "Net maaş, işveren maliyeti, teşvik ve tazminat hesapları.",
    type: "website",
    url: "/",
    siteName: "NetHesap",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "NetHesap — Bordro artık net.",
    description: "Net maaş, işveren maliyeti, teşvik ve tazminat hesapları.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="min-h-screen font-[var(--font-sans)] antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}

