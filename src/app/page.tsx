import Link from "next/link";
import type { Metadata } from "next";
import { CalculationMenu } from "@/components/CalculationMenu";
import Image from "next/image";
import { Calculator, ShieldCheck, TrendingDown } from "lucide-react";
import { LandingCtas } from "@/components/LandingCtas";

export const metadata: Metadata = {
  title: "NetHesap — Bordro artık net.",
  description:
    "Bordro hesaplamasını hızlı, şeffaf ve güvenilir şekilde yapın. Net maaş, brüt, işveren maliyeti ve detaylı kırılım.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NetHesap — Bordro artık net.",
    description: "Bordro hesaplamasını hızlı, şeffaf ve güvenilir şekilde yapın.",
    type: "website",
    url: "/",
  },
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-brand-text-secondary transition hover:bg-white/70 hover:text-brand-text-primary"
    >
      {label}
    </a>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden nh-surface nh-card-hover p-6">
      <div className="nh-gradient-line absolute left-0 top-0 h-0.5 w-full opacity-40" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/15" />

      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-full border border-slate-200/70 bg-white/70 shadow-sm">
          <span className="nh-gradient-text text-sm font-semibold">{n}</span>
        </div>
        <div>
          <div className="font-[var(--font-heading)] text-base font-semibold tracking-tight text-brand-text-primary">
            {title}
          </div>
          <div className="mt-1 text-sm leading-6 text-brand-text-secondary">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">{icon}</div>
        <div>
          <div className="text-lg font-semibold tracking-tight text-slate-900">{title}</div>
          <div className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "NetHesap",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
            description: "Türkiye bordro hesaplama: net/brüt, işveren maliyeti, teşvik ve tazminat simülasyonları.",
          }),
        }}
      />
      <header className="flex items-center justify-between gap-4">
        <Link href="/" aria-label="Ana sayfa" className="flex items-center">
          <Image
            src="/logo.png"
            alt="NetHesap"
            width={1000}
            height={176}
            priority
            sizes="(min-width: 640px) 220px, 180px"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <nav className="h-12 items-center gap-1 rounded-full border border-slate-200/70 bg-white/60 px-1.5 shadow-soft md:backdrop-blur sm:flex">
            <NavLink href="#hakkinda" label="Hakkında" />
            <NavLink href="#neden" label="Özellikler" />
            <NavLink href="#nasil" label="Süreç" />
            <NavLink href="#guven" label="Güven" />
            <NavLink href="#iletisim" label="İletişim" />
          </nav>

          <CalculationMenu className="md:block" />
        </div>
      </header>

      {/* Hero */}
      <section className="mt-14 lg:mt-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Bordro artık <span className="text-blue-600">net.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed">
            Personel maliyetlerinizi sürprizler olmadan yönetin. Maaş, teşvik ve tazminat hesaplamaları tek ekranda.
          </p>

          <LandingCtas />

          <div className="mt-6 text-sm text-slate-500">
            ⚡ Türkiye'nin en güncel hesaplama motoru. Tüm veriler GİB ve SGK parametreleriyle anlık eşleşir.
          </div>
        </div>

        <div className="nh-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-brand-text-secondary">Örnek çıktı</div>
              <div className="mt-1 font-[var(--font-heading)] text-lg font-semibold text-brand-text-primary">
                Detaylı Hesaplama
              </div>
            </div>
            <div className="text-xs font-medium text-brand-text-secondary">Özet</div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="nh-surface p-4">
              <div className="text-[11px] font-medium tracking-wide text-brand-text-secondary">Net Maaş</div>
              <div className="mt-1 font-[var(--font-heading)] text-3xl font-semibold tracking-tight text-brand-text-primary">
                40.000
              </div>
            </div>

            <div className="nh-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-text-secondary">SGK (İşçi)</span>
                <span className="font-semibold tabular-nums text-brand-text-primary">7.000</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-brand-text-secondary">Gelir Vergisi</span>
                <span className="font-semibold tabular-nums text-brand-text-primary">2.450</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-brand-text-secondary">Damga Vergisi</span>
                <span className="font-semibold tabular-nums text-brand-text-primary">0</span>
              </div>
              <div className="mt-3 border-t border-slate-200/70 pt-3 text-xs text-brand-text-secondary">
                Tam kırılım ve kümülatif matrah tek ekranda.
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* About */}
      <section id="hakkinda" className="mt-16 scroll-mt-24">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-[var(--font-heading)] text-xl font-semibold text-brand-text-primary">
              Hakkında
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-text-secondary sm:text-base">
              NetHesap; İK, muhasebe ve bordro uzmanları için tasarlanmış, Türkiye bordro hesaplamalarını
              <span className="font-semibold text-brand-text-primary"> şeffaf</span> ve
              <span className="font-semibold text-brand-text-primary"> mevzuata uygun</span> şekilde sunan bir
              hesaplama platformudur.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="nh-surface nh-card-hover p-5">
              <div className="text-[11px] font-medium tracking-wide text-brand-text-secondary">Odak</div>
              <div className="mt-1 font-[var(--font-heading)] text-lg font-semibold text-brand-text-primary">
                Doğruluk
              </div>
              <div className="mt-2 text-sm leading-6 text-brand-text-secondary">
                Konfigürasyon tabanlı, test edilebilir hesaplama motoru.
              </div>
            </div>
            <div className="nh-surface nh-card-hover p-5">
              <div className="text-[11px] font-medium tracking-wide text-brand-text-secondary">Yaklaşım</div>
              <div className="mt-1 font-[var(--font-heading)] text-lg font-semibold text-brand-text-primary">
                Şeffaflık
              </div>
              <div className="mt-2 text-sm leading-6 text-brand-text-secondary">
                Her sonuçta detaylı kesinti kırılımı ve kümülatif göstergeler.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="neden" className="mt-16 scroll-mt-24">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-slate-900">Özellikler</h2>
        <div className="mt-6 grid items-stretch gap-6 md:grid-cols-3">
          <ValueCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Tam Mevzuat Uyumu"
            desc="Güncel mevzuat motoruyla SGK ve vergi hesaplamalarındaki yasal riskleri ortadan kaldırın."
          />
          <ValueCard
            icon={<TrendingDown className="h-5 w-5" />}
            title="Maliyet Simülasyonu"
            desc="Zam, prim ve teşviklerin şirketinize olan toplam maliyetini saniyeler içinde görün."
          />
          <ValueCard
            icon={<Calculator className="h-5 w-5" />}
            title="Uçtan Uca Çözüm"
            desc="Brüt-net maaştan kıdem ve ihbar tazminatına kadar tüm süreçler elinizin altında."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="nasil" className="mt-16 scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[var(--font-heading)] text-xl font-semibold text-brand-text-primary">Süreç</h2>
            <div className="nh-gradient-line mt-2 h-px w-24 opacity-35" />
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Step n="1" title="Maaşı gir" desc="Brüt veya net tutarı belirleyin." />
          <Step n="2" title="Parametreleri seç" desc="Yan hakları ve teşvik tipini ekleyin." />
          <Step n="3" title="Sonucu gör" desc="İşveren maliyeti ve kesintileri inceleyin." />
        </div>
      </section>

      {/* Trust / Compliance */}
      <section
        id="guven"
        className="nh-surface mt-16 scroll-mt-24 p-8"
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-brand-text-primary">
              Güven ve Uyum
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-text-secondary">
              Arka planda çalışan canlı konfigürasyon motoru sayesinde oranları ezberlemenize gerek kalmaz. Tüm sonuçlar
              güncel GİB ve SGK parametreleriyle birebir eşleşir.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="nh-surface px-4 py-3 text-sm text-brand-text-secondary">
              ✅ 2026 Mevzuatına tam uyumlu
            </div>
            <div className="nh-surface px-4 py-3 text-sm text-brand-text-secondary">
              ✅ Kademeli gelir vergisi takibi
            </div>
            <div className="nh-surface px-4 py-3 text-sm text-brand-text-secondary">
              ✅ 5510 vb. yasal SGK teşvikleri
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="iletisim" className="mt-16 scroll-mt-24">
        <div className="nh-surface p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-[var(--font-heading)] text-xl font-semibold text-brand-text-primary">İletişim</h2>
              <p className="mt-3 text-sm leading-6 text-brand-text-secondary sm:text-base">
                Geri bildirim, iş birliği veya kurumsal kullanım için bize ulaşın.
              </p>
              <div className="mt-4 space-y-2 text-sm text-brand-text-secondary">
                <div>
                  <span className="font-medium text-brand-text-primary">E-posta:</span>{" "}
                  <a
                    className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                    href="mailto:nethesap@outlook.com.tr"
                  >
                    nethesap@outlook.com.tr
                  </a>
                </div>
                <div>
                  <span className="font-medium text-brand-text-primary">Adres:</span> Antalya/Türkiye
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-xs text-brand-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <div>© 2026 Engin Can Ergün · Tüm hakları saklıdır.</div>
        <div className="flex gap-4">
          <a className="hover:text-brand-text-primary" href="#hakkinda">
            Hakkında
          </a>
          <a className="hover:text-brand-text-primary" href="mailto:nethesap@outlook.com.tr">
            İletişim
          </a>
          <Link className="hover:text-brand-text-primary" href="/yasal-metinler">
            Yasal Metinler
          </Link>
        </div>
      </footer>
    </main>
  );
}

