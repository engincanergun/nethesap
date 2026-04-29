import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Net maaş hesaplama (2026)",
  description:
    "2026 Türkiye net maaş hesaplama: kesinti kırılımları (SGK, işsizlik, gelir vergisi) ve işveren maliyetiyle birlikte.",
  alternates: { canonical: "/net-maas-hesaplama" },
};

const faqs = [
  {
    q: "Net maaş nedir?",
    a: "Çalışanın eline geçen tutardır. Brüt ücretten SGK/işsizlik primi ve vergiler düşüldükten sonra kalan tutar net maaştır.",
  },
  {
    q: "Net maaş nasıl hesaplanır?",
    a: "Brüt ücret üzerinden SGK ve işsizlik primi hesaplanır; ardından vergi matrahına göre gelir vergisi dilimi uygulanır. Sonuç kalem kalem düşülerek net bulunur.",
  },
  {
    q: "Kümülatif vergi matrahı sonucu etkiler mi?",
    a: "Evet. Gelir vergisi dilimleri kümülatif matraha göre değiştiği için yıl içinde net maaş ve kesintiler farklılaşabilir.",
  },
] as const;

export default function NetMaasHesaplamaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <div className="text-xs font-medium text-brand-text-secondary">
          <span className="nh-gradient-text">NetHesap</span>
        </div>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold tracking-tight text-brand-text-primary sm:text-4xl">
          Net maaş hesaplama (2026)
        </h1>
        <p className="mt-3 text-sm leading-6 text-brand-text-secondary sm:text-base">
          Net maaş, brüt ücretten yasal kesintiler düşüldükten sonra çalışanın eline geçen tutardır. Aşağıdaki hesaplama
          ekranında kesinti kırılımlarını ve işveren maliyetini tek ekranda görebilirsin.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/bordro-hesaplama" className="nh-pill">
            Net maaşı şimdi hesapla
          </Link>
          <Link href="/isveren-maliyeti-hesaplama" className="nh-pill">
            İşveren maliyeti sayfası
          </Link>
        </div>
      </header>

      <section className="nh-surface p-6">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-brand-text-primary">Sık sorulanlar</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-slate-200/70 bg-white/60 p-4">
              <div className="text-sm font-semibold text-brand-text-primary">{f.q}</div>
              <div className="mt-2 text-sm leading-6 text-brand-text-secondary">{f.a}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

