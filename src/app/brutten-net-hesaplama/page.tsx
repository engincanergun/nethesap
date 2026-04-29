import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brütten net hesaplama (2026)",
  description:
    "2026 Türkiye brütten net maaş hesaplama: SGK/işsizlik, gelir vergisi dilimleri ve detaylı bordro kırılımı.",
  alternates: { canonical: "/brutten-net-hesaplama" },
};

const faqs = [
  {
    q: "Brütten net maaş hesaplama nedir?",
    a: "Brüt ücretin yasal kesintiler sonrası çalışanın eline geçen net tutara dönüştürülmesidir.",
  },
  {
    q: "Gelir vergisi dilimi brütten net sonucu değiştirir mi?",
    a: "Evet. Yıl içinde kümülatif matrah arttıkça gelir vergisi dilimi değişebilir; bu da net maaşı etkiler.",
  },
  {
    q: "Yan haklar (yemek/yol) hesaplamaya dahil mi?",
    a: "Yan hakların bordroya dahil edilme şekline göre değişir. NetHesap’ta parametreleri seçerek senaryoya göre sonucu görebilirsin.",
  },
] as const;

export default function BruttenNetHesaplamaPage() {
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
          Brütten net hesaplama (2026)
        </h1>
        <p className="mt-3 text-sm leading-6 text-brand-text-secondary sm:text-base">
          Brüt ücretinizi girin; SGK ve vergi kalemlerinin tamamını kırılımlı biçimde görün. Gelir vergisi dilimi ve
          kümülatif matrah etkisini takip ederek yıl içi değişimi de yönetebilirsiniz.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard" className="nh-pill">
            Brütten net hesapla
          </Link>
          <Link href="/net-maas-hesaplama" className="nh-pill">
            Net maaş sayfası
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

