import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senaryo simülasyonu",
  description: "Maaş ve teşvik parametrelerini değiştirin, fark analizini anında görün.",
  alternates: { canonical: "/scenario" },
};

export default function ScenarioPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <div className="text-xs font-medium text-brand-text-secondary">
          <span className="nh-gradient-text">NetHesap</span>
        </div>
        <h1 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold tracking-tight text-brand-text-primary sm:text-3xl">
          Senaryo Simülasyonu
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-text-secondary">
          “Eğer bunu değiştirirsem ne olur?” sorusu için karşılaştırmalı analiz ekranı. (Yakında)
        </p>

        <div className="mt-4">
          <Link
            href="/dashboard/bordro-hesaplama"
            className="nh-pill"
          >
            Bordro Hesaplama’ya dön
          </Link>
        </div>
      </header>

      <section className="nh-surface-strong nh-card-hover p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="nh-surface p-5">
            <div className="text-sm font-semibold text-brand-text-primary">Girdi Paneli</div>
            <ul className="mt-3 list-disc pl-5 text-sm text-brand-text-secondary">
              <li>Maaş slider</li>
              <li>Prim input</li>
              <li>Teşvik seçimi</li>
            </ul>
          </div>
          <div className="nh-surface p-5">
            <div className="text-sm font-semibold text-brand-text-primary">Fark Analizi</div>
            <ul className="mt-3 list-disc pl-5 text-sm text-brand-text-secondary">
              <li>Önceki sonuç</li>
              <li>Yeni sonuç</li>
              <li>+/- farklar (maliyet, net değişim)</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

