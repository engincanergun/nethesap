import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { CalculationMenu } from "@/components/CalculationMenu";

export const metadata: Metadata = {
  title: "Yasal uyarı ve kullanım koşulları",
  description: "NetHesap kullanım koşulları, sorumluluk reddi ve bilgilendirme metinleri.",
  alternates: { canonical: "/yasal-metinler" },
};

export default function LegalTextsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <SiteHeader
        right={
          <div className="hidden items-center gap-2 sm:flex">
            <CalculationMenu />
          </div>
        }
      />

      <section className="mt-10 nh-surface p-8">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-brand-text-secondary">
            <Link href="/" className="hover:text-brand-text-primary">
              Ana Sayfa
            </Link>{" "}
            <span className="text-brand-text-secondary">/</span> Yasal Metinler
          </div>
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight text-brand-text-primary sm:text-3xl">
            Yasal Uyarı ve Kullanım Koşulları
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-text-secondary sm:text-base">
            Aşağıdaki metinler bilgilendirme amaçlıdır. Platformu kullanarak bu şartları okumuş ve kabul etmiş sayılırsınız.
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-brand-text-secondary">
          <section>
            <h2 className="text-base font-semibold text-brand-text-primary">1. Sorumluluk Reddi ve Hesaplamaların Niteliği</h2>
            <p className="mt-2">
              NetHesap ("Platform") web sitesi üzerinden sunulan brüt-net maaş hesaplamaları, işveren maliyeti analizleri,
              SGK teşvik simülasyonları, kıdem ve ihbar tazminatı tutarları ile tüm vergi dilimi hesaplamaları tamamen
              bilgilendirme, öngörü ve simülasyon amaçlıdır. Platformdan elde edilen hiçbir sonuç; resmi bir tahakkuk fişi,
              kesinleşmiş bordro belgesi, yasal bir kanıt veya profesyonel mali danışmanlık hizmeti yerine geçmez.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-brand-text-primary">2. Hata ve Zarar Sorumluluğu</h2>
            <p className="mt-2">
              NetHesap, hesaplama motorlarını güncel mevzuatlara (GİB, SGK vb.) uygun tutmak için azami gayreti gösterir.
              Ancak yasal mevzuatların karmaşıklığı, yorum farklılıkları veya sistemsel gecikmeler nedeniyle sonuçlarda
              sapmalar veya hatalar oluşabilir.
            </p>
            <p className="mt-3">
              Kullanıcıların bu platformdaki verilere dayanarak alacağı ticari, hukuki veya finansal kararlardan doğabilecek;
              eksik veya hatalı vergi / SGK primi ödemeleri, resmi kurumlardan (SGK, Maliye Bakanlığı vb.) gelebilecek idari
              para cezaları veya gecikme zamları, işçi ve işveren arasındaki uyuşmazlıklardan doğan her türlü hukuki sonuç ve
              tazminat yükümlülükleri, doğrudan veya dolaylı maddi ve manevi zararlar kapsamında NetHesap'ın, kurucularının,
              geliştiricilerinin ve çalışanlarının hiçbir hukuki veya cezai sorumluluğu bulunmamaktadır. Platformu kullanan
              kişi veya kurumlar, tüm riskin ve sorumluluğun tamamen kendilerine ait olduğunu peşinen kabul eder.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-brand-text-primary">3. Profesyonel Danışmanlık Zorunluluğu</h2>
            <p className="mt-2">
              Platformumuz bir "Serbest Muhasebeci Mali Müşavirlik (SMMM)" veya hukuk danışmanlığı hizmeti sunmamaktadır.
              İşletmenize ait resmi bordroların düzenlenmesi, yasal bildirgelerin verilmesi ve iş akdi fesih süreçlerinde
              mutlaka yetkili bir Mali Müşavir veya İş Hukuku Uzmanı (Avukat) ile çalışmanız gerekmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-brand-text-primary">4. Girilen Verilerin Doğruluğu</h2>
            <p className="mt-2">
              Hesaplamaların doğruluğu, kullanıcının sisteme girdiği parametrelerin (brüt maaş, teşvik durumu, yan haklar,
              kümülatif vergi matrahı vb.) eksiksiz ve doğru olmasına bağlıdır. Hatalı veri girişinden kaynaklanan yanlış
              sonuçlardan NetHesap sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-brand-text-primary">5. Mevzuat Değişiklikleri</h2>
            <p className="mt-2">
              Türkiye Cumhuriyeti kanunlarında, asgari ücret tutarlarında, SGK oranlarında veya vergi dilimlerinde
              yaşanabilecek değişikliklerin sisteme yansıtılması belirli bir süre alabilir. Kullanıcı, işlem yaptığı tarihteki
              yasal oranların güncelliğini teyit etmekle yükümlüdür.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-brand-text-primary">6. Kabul Beyanı</h2>
            <p className="mt-2">
              Bu web sitesini kullanan, hesaplama araçlarından faydalanan ve sonuçları inceleyen her kullanıcı, yukarıda
              belirtilen tüm yasal uyarı ve şartları okumuş, anlamış ve eksiksiz olarak kabul etmiş sayılır.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm md:backdrop-blur">
            <h2 className="text-base font-semibold text-brand-text-primary">İletişim Bilgileri</h2>
            <p className="mt-2">
              Hesaplamalar, platform kullanımı veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="mt-3 space-y-1">
              <div>
                <span className="font-medium text-brand-text-primary">E-posta:</span>{" "}
                <a className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500" href="mailto:nethesap@outlook.com.tr">
                  nethesap@outlook.com.tr
                </a>
              </div>
              <div>
                <span className="font-medium text-brand-text-primary">Adres:</span> Antalya / Türkiye
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

