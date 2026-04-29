import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İşveren maliyeti hesaplama (2026)",
  description:
    "2026 Türkiye işveren maliyeti hesaplama: brüt ücret, SGK işveren payı, teşvik etkisi ve toplam maliyet kırılımı.",
  alternates: { canonical: "/isveren-maliyeti-hesaplama" },
};

const faqs = [
  {
    q: "İşveren maliyeti nedir?",
    a: "Brüt ücret + işveren SGK payları + diğer zorunlu maliyetlerin toplamıdır. Teşvikler varsa toplam maliyet düşebilir.",
  },
  {
    q: "Teşvikler işveren maliyetini nasıl etkiler?",
    a: "Uygulanan teşvik türüne göre işveren SGK payının bir kısmı karşılanabilir. Bu da toplam maliyeti doğrudan azaltır.",
  },
  {
    q: "İşveren maliyetini doğru hesaplamak neden önemli?",
    a: "Bütçe planlama, tekliflendirme ve zam/prim kararlarında sürpriz maliyetleri önlemek için.",
  },
] as const;

export default function IsverenMaliyetiHesaplamaPage() {
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
          İşveren maliyeti hesaplama (2026)
        </h1>
        <p className="mt-3 text-sm leading-6 text-brand-text-secondary sm:text-base">
          Tek bir personelin toplam maliyeti sadece brüt ücret değildir. İşveren SGK payı, teşvikler ve diğer kalemler
          toplam maliyeti belirler. Hesaplama ekranında kırılımları anında görebilirsin.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/bordro-hesaplama" className="nh-pill">
            İşveren maliyetini hesapla
          </Link>
          <Link href="/brutten-net-hesaplama" className="nh-pill">
            Brütten net sayfası
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

