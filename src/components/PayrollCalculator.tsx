"use client";

import { useMemo, useState } from "react";
import { calculatePayroll, payrollConfig2026, solveGrossFromNet, type IncentiveType } from "@/lib/payroll-engine";
import Image from "next/image";
import Link from "next/link";

function tryParseNumber(v: string) {
  const normalized = v.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

const amount = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatAmount(n: number) {
  return amount.format(Math.round(n));
}

function formatInputAmount(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return "";
  return amount.format(n);
}

function formatIncentiveLabel(v: IncentiveType) {
  switch (v) {
    case "NONE":
      return "Teşviksiz";
    case "FIVE_POINT":
      return "5 Puan";
    case "TWO_POINT":
      return "2 Puan";
    default: {
      // Defensive fallback for future config values
      return String(v);
    }
  }
}

function Field({
  label,
  value,
  onChange,
  hint = "TL",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium tracking-wide text-brand-text-secondary">{label}</div>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(formatInputAmount(e.target.value))}
          placeholder={placeholder}
          dir="ltr"
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-card border border-slate-200 bg-white px-3 py-2.5 pr-11 text-left text-sm font-medium tabular-nums text-brand-text-primary outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/15"
          inputMode="decimal"
        />
        {hint ? (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-brand-text-secondary">
            {hint}
          </div>
        ) : null}
      </div>
    </label>
  );
}

function Segmented({
  value,
  onChange,
}: {
  value: "GROSS" | "NET";
  onChange: (v: "GROSS" | "NET") => void;
}) {
  return (
    <div className="inline-flex rounded-card border border-slate-200/70 bg-white/70 p-1 shadow-soft md:backdrop-blur">
      <button
        type="button"
        onClick={() => onChange("GROSS")}
        className={
          value === "GROSS"
            ? "rounded-[10px] bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm"
            : "rounded-[10px] px-3 py-2 text-sm font-semibold text-brand-text-primary hover:bg-white/60"
        }
      >
        Brüt
      </button>
      <button
        type="button"
        onClick={() => onChange("NET")}
        className={
          value === "NET"
            ? "rounded-[10px] bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm"
            : "rounded-[10px] px-3 py-2 text-sm font-semibold text-brand-text-primary hover:bg-white/60"
        }
      >
        Net
      </button>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  emphasized,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <div>
        <div className={emphasized ? "text-sm font-semibold text-brand-text-primary" : "text-sm text-brand-text-primary"}>
          {label}
        </div>
        {sub ? <div className="mt-1 text-xs text-brand-text-secondary">{sub}</div> : null}
      </div>
      <div className={emphasized ? "text-sm font-semibold tabular-nums text-brand-primary" : "text-sm tabular-nums"}>
        {value}
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-slate-200/70 bg-white/55 p-4 shadow-sm">
      <div className="text-[11px] font-medium tracking-wide text-brand-text-secondary">{label}</div>
      <div className="mt-1 font-[var(--font-heading)] text-3xl font-semibold tracking-tight text-brand-text-primary">
        {value}
      </div>
    </div>
  );
}

function ScenarioCard({
  title,
  subtitle,
  net,
  cost,
  deltaCost,
}: {
  title: string;
  subtitle: string;
  net: number;
  cost: number;
  deltaCost?: number;
}) {
  return (
    <div className="rounded-card border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-0.5 text-xs text-brand-text-secondary">{subtitle}</div>
        </div>
        {typeof deltaCost === "number" ? (
          <div className="text-right text-xs text-brand-text-secondary">
            Fark:{" "}
            <span className={deltaCost <= 0 ? "font-semibold text-brand-accent" : "font-semibold text-rose-600"}>
              {formatAmount(deltaCost)}
            </span>
          </div>
        ) : null}
      </div>
      <div className="mt-4 grid gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-xs text-brand-text-secondary">Net</div>
          <div className="text-sm font-semibold tabular-nums">{formatAmount(net)}</div>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-xs text-brand-text-secondary">İşveren Maliyeti</div>
          <div className="text-sm font-semibold tabular-nums">{formatAmount(cost)}</div>
        </div>
      </div>
    </div>
  );
}

export function PayrollCalculator() {
  const [salaryMode, setSalaryMode] = useState<"GROSS" | "NET">("GROSS");
  const [grossSalary, setGrossSalary] = useState("50000");
  const [targetNetSalary, setTargetNetSalary] = useState("40000");
  const [cumulativeTaxBase, setCumulativeTaxBase] = useState("0");
  const [bonus, setBonus] = useState("0");
  const [mealAllowance, setMealAllowance] = useState("0");
  const [transportAllowance, setTransportAllowance] = useState("0");
  const [incentiveType, setIncentiveType] = useState<IncentiveType>("NONE");

  const [compareIncentiveType, setCompareIncentiveType] = useState<IncentiveType>("FIVE_POINT");

  const baseInput = useMemo(
    () => ({
      cumulativeTaxBase: tryParseNumber(cumulativeTaxBase),
      incentiveType,
      compensation: {
        bonus: tryParseNumber(bonus),
        mealAllowance: tryParseNumber(mealAllowance),
        transportAllowance: tryParseNumber(transportAllowance),
      },
    }),
    [bonus, cumulativeTaxBase, incentiveType, mealAllowance, transportAllowance],
  );

  const resolvedGrossSalary = useMemo(() => {
    if (salaryMode === "GROSS") return tryParseNumber(grossSalary);
    const solved = solveGrossFromNet(
      { ...baseInput, targetNetSalary: tryParseNumber(targetNetSalary) },
      payrollConfig2026,
    );
    return solved.grossSalary;
  }, [baseInput, grossSalary, salaryMode, targetNetSalary]);

  const input = useMemo(
    () => ({
      ...baseInput,
      grossSalary: resolvedGrossSalary,
    }),
    [baseInput, resolvedGrossSalary],
  );

  const result = useMemo(() => calculatePayroll(input, payrollConfig2026), [input]);

  const compareResult = useMemo(
    () => calculatePayroll({ ...input, incentiveType: compareIncentiveType }, payrollConfig2026),
    [compareIncentiveType, input],
  );

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
      <div className="sticky top-0 z-20 -mx-5 border-b border-slate-200/70 bg-brand-bg/70 px-5 py-3 md:backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" aria-label="Ana sayfa" className="flex-none">
            <Image
              src="/logo.png"
              alt="NetHesap"
              width={1000}
              height={176}
              priority
              sizes="200px"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => scrollTo("detay")}
            className="flex h-10 flex-none items-center justify-center rounded-full border border-slate-200/70 bg-white/70 px-4 text-xs font-semibold shadow-soft md:backdrop-blur transition hover:bg-white/80 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
          >
            <span className="nh-gradient-text">Detaylı Hesaplama</span>
          </button>
        </div>
      </div>

      <header className="mb-7 mt-6 flex flex-col gap-2 sm:mb-9">
        <h1 className="font-[var(--font-heading)] text-3xl font-semibold tracking-tight text-brand-text-primary sm:text-4xl">
          Bordro artık net.
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-brand-text-secondary sm:text-base">
          Brüt veya net girin. Kümülatif vergi matrahı ve teşvik seçimiyle sonucu saniyeler içinde görün.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section id="girdi" className="nh-surface-strong scroll-mt-24 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-[var(--font-heading)] text-base font-semibold text-brand-text-primary">
                Maaşı Hesapla
              </h2>
              <p className="mt-1 text-xs leading-5 text-brand-text-secondary">
                Brüt veya net üzerinden hesapla. Kümülatif matrah ve teşvik seçimi sonuçları etkiler.
              </p>
            </div>
            <Segmented value={salaryMode} onChange={setSalaryMode} />
          </div>

          <div className="mt-6 grid gap-4">
            {salaryMode === "GROSS" ? (
              <Field label="Brüt Maaş" value={grossSalary} onChange={setGrossSalary} placeholder="Örn: 50.000" />
            ) : (
              <Field label="Net Maaş" value={targetNetSalary} onChange={setTargetNetSalary} placeholder="Örn: 40.000" />
            )}

            {salaryMode === "NET" ? (
              <div className="nh-surface px-4 py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-xs font-medium text-brand-text-secondary">Hesaplanan brüt</div>
                  <div className="text-sm font-semibold tabular-nums text-brand-text-primary">
                    {formatAmount(resolvedGrossSalary)}
                  </div>
                </div>
                <div className="mt-1 text-xs leading-5 text-brand-text-secondary">
                  Bu değer, hedef nete en yakın brütü bulmak için ters hesap ile elde edilir.
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prim / Bonus" value={bonus} onChange={setBonus} placeholder="0" />
              <Field
                label="Kümülatif Vergi Matrahı"
                value={cumulativeTaxBase}
                onChange={setCumulativeTaxBase}
                placeholder="0"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Yemek Yardımı" value={mealAllowance} onChange={setMealAllowance} placeholder="0" />
              <Field label="Ulaşım Yardımı" value={transportAllowance} onChange={setTransportAllowance} placeholder="0" />
            </div>

            <label className="block">
              <div className="mb-1 text-xs font-medium tracking-wide text-brand-text-secondary">Teşvik</div>
              <select
                value={incentiveType}
                onChange={(e) => setIncentiveType(e.target.value as IncentiveType)}
                className="w-full rounded-card border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-brand-text-primary outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/15"
              >
                <option value="NONE">Teşviksiz</option>
                <option value="FIVE_POINT">5 Puan</option>
                <option value="TWO_POINT">2 Puan</option>
              </select>
              <div className="mt-1 text-xs leading-5 text-brand-text-secondary">İşveren SGK oranı teşvike göre uygulanır.</div>
            </label>
          </div>
        </section>

        <section
          id="sonuc"
          className="nh-surface-strong scroll-mt-24 p-6 lg:sticky lg:top-24 lg:self-start"
        >
          <h2 className="font-[var(--font-heading)] text-base font-semibold text-brand-text-primary">Sonucu Gör</h2>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <KpiCard label="Net Maaş" value={formatAmount(result.netSalary)} />
              <KpiCard label="İşveren Maliyeti" value={formatAmount(result.employerCost)} />
            </div>

            <div id="detay" className="scroll-mt-24 rounded-card border border-slate-200">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
                <div className="text-sm font-semibold text-brand-text-primary">Detaylı Hesaplama</div>
                <div className="text-xs tabular-nums text-brand-text-secondary">
                  Kümülatif: {formatAmount(result.breakdown.bases.cumulativeTaxBaseNew)}
                </div>
              </div>
              <div className="divide-y divide-slate-200 text-sm">
                <Row label="Brüt Toplam" value={formatAmount(result.breakdown.grossTotal)} />
                <Row label="SGK (İşçi)" value={formatAmount(result.breakdown.employeeDeductions.sgkEmployee)} />
                <Row label="İşsizlik (İşçi)" value={formatAmount(result.breakdown.employeeDeductions.unemploymentEmployee)} />
                <Row
                  label="Gelir Vergisi"
                  value={formatAmount(result.breakdown.taxes.incomeTaxPayable)}
                  sub={`Asıl: ${formatAmount(result.breakdown.taxes.incomeTaxGross)} · Asgari ücret istisnası: -${formatAmount(
                    result.breakdown.taxes.minimumWageIncomeTaxExemption,
                  )}`}
                />
                <Row
                  label="Damga Vergisi"
                  value={formatAmount(result.breakdown.taxes.stampTaxPayable)}
                  sub={`Asıl: ${formatAmount(result.breakdown.taxes.stampTaxGross)} · Asgari ücret istisnası: -${formatAmount(
                    result.breakdown.taxes.minimumWageStampTaxExemption,
                  )}`}
                />
                <Row label="Net Maaş" value={formatAmount(result.netSalary)} emphasized />
              </div>
            </div>

            <div id="karsilastirma" className="scroll-mt-24 rounded-card border border-slate-200">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
                <div className="text-sm font-semibold text-brand-text-primary">Senaryo Karşılaştırma</div>
                <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                  <span>Karşılaştır:</span>
                  <select
                    value={compareIncentiveType}
                    onChange={(e) => setCompareIncentiveType(e.target.value as IncentiveType)}
                    className="rounded-card border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-brand-secondary"
                  >
                    <option value="NONE">Teşviksiz</option>
                    <option value="FIVE_POINT">5 Puan</option>
                    <option value="TWO_POINT">2 Puan</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                <ScenarioCard
                  title="Seçili Senaryo"
                  subtitle={`Teşvik: ${formatIncentiveLabel(incentiveType)}`}
                  net={result.netSalary}
                  cost={result.employerCost}
                />
                <ScenarioCard
                  title="Karşılaştırma"
                  subtitle={`Teşvik: ${formatIncentiveLabel(compareIncentiveType)}`}
                  net={compareResult.netSalary}
                  cost={compareResult.employerCost}
                  deltaCost={compareResult.employerCost - result.employerCost}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

