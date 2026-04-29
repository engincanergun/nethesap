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
  title: {
    default: "NetHesap — Bordro artık net.",
    template: "%s — NetHesap",
  },
  description: "Türkiye 2026 bordro hesaplama: net, brüt, işveren maliyeti ve detaylı kırılım.",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  applicationName: "NetHesap",
  referrer: "origin-when-cross-origin",
  creator: "NetHesap",
  publisher: "NetHesap",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.png" }],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "NetHesap",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.svg`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "NetHesap",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "tr-TR",
      },
    ],
  };

  return (
    <html lang="tr" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-[var(--font-sans)] antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}

