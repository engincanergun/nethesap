"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, ClipboardList, HandCoins, Info, Landmark, PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";
import { calculatePayroll, payrollConfig2026, solveGrossFromNet, type IncentiveType } from "@/lib/payroll-engine";

const trInt = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const trMoney2 = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatTL(n: number) {
  if (!Number.isFinite(n)) return "0";
  return trInt.format(Math.round(n));
}

function formatTL2(n: number) {
  if (!Number.isFinite(n)) return "0,00";
  return trMoney2.format(n);
}

function parseNumericInput(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

function AnimatedNumber({
  value,
  className = "",
  format = formatTL,
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const formatted = format(value);
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={formatted}
        initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
        transition={{ duration: 0.18 }}
        className={className}
      >
        {formatted}
      </motion.span>
    </AnimatePresence>
  );
}

function Pill({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
        active
          ? "border-blue-100 bg-white text-slate-900 shadow-sm"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-100 hover:bg-white hover:shadow-sm",
      ].join(" ")}
    >
      <span className={active ? "text-blue-900" : "text-slate-500"}>{icon}</span>
      {label}
    </button>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  placeholder,
  hint = "TL",
  optional,
}: {
  label: string;
  value: number | null;
  onChange: (next: number | null) => void;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
}) {
  const display = value === null ? "" : formatTL(value);
  return (
    <label className="block">
      <div className="mb-2 flex items-start gap-2">
        <div className="text-sm font-medium leading-5 text-slate-800">{label}</div>
        {optional ? (
          <span className="mt-0.5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium leading-none text-slate-500">
            Opsiyonel
          </span>
        ) : null}
      </div>
      <div className="relative">
        <input
          value={display}
          onChange={(e) => {
            const raw = e.target.value;
            if (optional && raw.trim() === "") return onChange(null);
            onChange(parseNumericInput(raw));
          }}
          placeholder={placeholder}
          inputMode="numeric"
          dir="ltr"
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-200 bg-white p-3 pr-12 text-left text-base font-semibold tabular-nums text-slate-800 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
          {hint}
        </div>
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
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {(["GROSS", "NET"] as const).map((k) => {
        const active = value === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={
              active
                ? "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                : "rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            }
          >
            {k === "GROSS" ? "Brüt" : "Net"}
          </button>
        );
      })}
    </div>
  );
}

type DisclosureRowProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  children: React.ReactNode;
  tone?: "neutral" | "dark";
};

function DisclosureRow({ title, value, icon, children, tone = "neutral" }: DisclosureRowProps) {
  // Default-open so users immediately see breakdowns.
  const [open, setOpen] = useState(true);
  const [pinned, setPinned] = useState(true);
  const baseText = tone === "dark" ? "text-white/85" : "text-slate-500";
  const valueText = tone === "dark" ? "text-white" : "text-slate-900";
  const border = tone === "dark" ? "border-white/10" : "border-slate-100";
  const hoverBg = tone === "dark" ? "hover:bg-white/5" : "hover:bg-slate-50";

  return (
    <div
      className={`rounded-xl border ${border} overflow-hidden`}
      onMouseEnter={() => {
        // Desktop UX: hover reveals breakdown (unless user pinned it).
        if (!pinned) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!pinned) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => {
          // Mobile/intent UX: click pins/unpins the accordion state.
          setPinned((prev) => {
            const nextPinned = !prev;
            setOpen(nextPinned ? true : false);
            return nextPinned;
          });
        }}
        className={`flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left transition-all duration-300 ${hoverBg}`}
      >
        <div className="flex items-center gap-3">
          <span className={tone === "dark" ? "text-blue-300" : "text-blue-900"}>{icon}</span>
          <div>
            <div className={`text-sm font-semibold ${tone === "dark" ? "text-white" : "text-slate-800"}`}>{title}</div>
            <div className={`text-xs ${baseText}`}>{pinned ? "Sabitlendi · Kapatmak için tıkla" : "Detay için üzerine gel veya tıkla"}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-sm font-semibold tabular-nums ${valueText}`}>
            <AnimatedNumber value={value} />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={tone === "dark" ? "bg-white/5" : "bg-white"}
          >
            <div className={`px-4 py-3 text-sm ${tone === "dark" ? "text-white/85" : "text-slate-600"}`}>
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MiniLine({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "dark" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className={tone === "dark" ? "text-sm text-white/70" : "text-sm text-slate-500"}>{label}</div>
      <div className={tone === "dark" ? "text-sm font-semibold tabular-nums text-white" : "text-sm font-semibold tabular-nums text-slate-900"}>
        <AnimatedNumber value={value} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <a href="/" aria-label="Ana sayfa">
          <Image src="/logo.png" alt="NetHesap" width={1000} height={176} priority className="h-10 w-auto object-contain" />
        </a>
      </div>
    </header>
  );
}

function PayrollModule() {
  const [mode, setMode] = useState<"GROSS" | "NET">("GROSS");
  const [grossSalary, setGrossSalary] = useState(50_000);
  const [targetNet, setTargetNet] = useState(40_000);
  const [bonus, setBonus] = useState(0);
  const [meal, setMeal] = useState(0);
  const [transport, setTransport] = useState(0);
  const [monthIndex, setMonthIndex] = useState(1);
  const [cumulativeManual, setCumulativeManual] = useState<number | null>(null);
  const [incentiveType, setIncentiveType] = useState<IncentiveType>("NONE");

  const grossTotalThisMonth = grossSalary + bonus + meal + transport;
  const cumulativeAuto = useMemo(() => {
    const monthsBefore = Math.max(0, Math.min(11, monthIndex - 1));
    if (monthsBefore === 0) return 0;
    const sgkBase = Math.min(payrollConfig2026.sgkCeiling, Math.max(payrollConfig2026.sgkFloor, grossTotalThisMonth));
    const sgkEmployee = sgkBase * payrollConfig2026.sgkEmployee;
    const unemploymentEmployee = sgkBase * payrollConfig2026.unemploymentEmployee;
    const monthlyTaxBase = Math.max(0, grossTotalThisMonth - sgkEmployee - unemploymentEmployee);
    return monthlyTaxBase * monthsBefore;
  }, [grossTotalThisMonth, monthIndex]);

  const cumulativeTaxBase = cumulativeManual ?? cumulativeAuto;

  const resolvedGross = useMemo(() => {
    if (mode === "GROSS") return grossSalary;
    const solved = solveGrossFromNet(
      {
        targetNetSalary: targetNet,
        cumulativeTaxBase,
        incentiveType,
        compensation: { bonus, mealAllowance: meal, transportAllowance: transport },
      },
      payrollConfig2026,
    );
    return solved.grossSalary;
  }, [bonus, cumulativeTaxBase, incentiveType, meal, mode, targetNet, transport, grossSalary]);

  const result = useMemo(
    () =>
      calculatePayroll(
        {
          grossSalary: resolvedGross,
          cumulativeTaxBase,
          incentiveType,
          compensation: { bonus, mealAllowance: meal, transportAllowance: transport },
        },
        payrollConfig2026,
      ),
    [bonus, cumulativeTaxBase, incentiveType, meal, resolvedGross, transport],
  );

  const stateDeductions = result.breakdown.employeeDeductions.sgkEmployee + result.breakdown.employeeDeductions.unemploymentEmployee;
  const taxDeductions = result.breakdown.taxes.incomeTaxPayable + result.breakdown.taxes.stampTaxPayable;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="col-span-1 lg:col-span-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                <ShieldCheck className="h-4 w-4" />
                Maaş / Bordro Hesaplama
              </div>
              <div className="mt-1 text-sm text-slate-500">Verileri girin; sonuçlar anında sağ panelde güncellensin.</div>
            </div>
            <Segmented value={mode} onChange={setMode} />
          </div>

          <div className="mt-6 grid gap-6">
            {mode === "GROSS" ? (
              <MoneyField label="Maaş (Brüt)" value={grossSalary} onChange={(v) => setGrossSalary(v ?? 0)} placeholder="Örn: 50.000" />
            ) : (
              <MoneyField label="Maaş (Net)" value={targetNet} onChange={(v) => setTargetNet(v ?? 0)} placeholder="Örn: 40.000" />
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <MoneyField label="Yemek" value={meal} onChange={(v) => setMeal(v ?? 0)} placeholder="0" />
              <MoneyField label="Yol" value={transport} onChange={(v) => setTransport(v ?? 0)} placeholder="0" />
              <MoneyField label="Prim" value={bonus} onChange={(v) => setBonus(v ?? 0)} placeholder="0" />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Info className="h-4 w-4" />
                  Şeffaflık
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-500">
                  Kümülatif matrahı boş bırakırsanız, seçtiğiniz aya göre otomatik tahmin edilir.
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <div className="mb-2 text-sm font-medium text-slate-800">Hesaplanacak Ay</div>
                <select
                  value={String(monthIndex)}
                  onChange={(e) => setMonthIndex(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                >
                  {[
                    "Ocak",
                    "Şubat",
                    "Mart",
                    "Nisan",
                    "Mayıs",
                    "Haziran",
                    "Temmuz",
                    "Ağustos",
                    "Eylül",
                    "Ekim",
                    "Kasım",
                    "Aralık",
                  ].map((m, idx) => (
                    <option key={m} value={String(idx + 1)}>
                      {m}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-xs leading-5 text-slate-500">
                  Otomatik tahmin: <span className="font-semibold tabular-nums text-slate-700">{formatTL(cumulativeAuto)}</span>
                </div>
              </label>

              <MoneyField
                label="Kümülatif Vergi Matrahı"
                value={cumulativeManual}
                onChange={setCumulativeManual}
                placeholder={`Otomatik: ${formatTL(cumulativeAuto)}`}
                optional
              />
            </div>

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-800">Teşvik Tipi</div>
              <select
                value={incentiveType}
                onChange={(e) => setIncentiveType(e.target.value as IncentiveType)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="FIVE_POINT">5 Puanlık İndirim</option>
                <option value="TWO_POINT">2 Puanlık İndirim</option>
                <option value="NONE">Teşviksiz</option>
              </select>
              <div className="mt-2 text-xs text-slate-500">İşveren SGK oranı seçime göre uygulanır.</div>
            </label>
          </div>
        </div>
      </section>

      <section className="col-span-1 lg:col-span-7">
        <div className="sticky top-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-blue-900">Net Maaş</div>
                <div className="mt-1 text-sm text-slate-500">Sonuçlar anlık güncellenir.</div>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Net</div>
            </div>
            <div className="mt-5 text-5xl font-bold tracking-tight text-emerald-600 tabular-nums">
              <AnimatedNumber value={result.netSalary} />
            </div>
            <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500">Brüt Toplam</div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                  <AnimatedNumber value={result.breakdown.grossTotal} />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Kümülatif Matrah</div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                  <AnimatedNumber value={result.breakdown.bases.cumulativeTaxBaseNew} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
              <ClipboardList className="h-4 w-4" />
              Kesintiler
            </div>
            <div className="mt-4 space-y-3">
              <DisclosureRow title="Devlet Kesintileri (SGK vb.)" value={stateDeductions} icon={<Landmark className="h-4 w-4" />}>
                <div className="space-y-2">
                  <MiniLine label="SGK İşçi Payı" value={result.breakdown.employeeDeductions.sgkEmployee} />
                  <MiniLine label="İşsizlik İşçi Payı" value={result.breakdown.employeeDeductions.unemploymentEmployee} />
                </div>
              </DisclosureRow>

              <DisclosureRow title="Vergi Kesintileri" value={taxDeductions} icon={<TrendingUp className="h-4 w-4" />}>
                <div className="space-y-2">
                  <MiniLine label="Gelir Vergisi" value={result.breakdown.taxes.incomeTaxPayable} />
                  <MiniLine label="Damga Vergisi" value={result.breakdown.taxes.stampTaxPayable} />
                </div>
              </DisclosureRow>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <HandCoins className="h-4 w-4" />
                İşveren Maliyeti
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
                Kritik
              </div>
            </div>

            <div className="mt-5 text-4xl font-bold tracking-tight tabular-nums">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(56,189,248,0.18)]">
                <AnimatedNumber value={result.employerCost} />
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <DisclosureRow
                tone="dark"
                title="Toplam İşveren Maliyeti"
                value={result.employerCost}
                icon={<PiggyBank className="h-4 w-4" />}
              >
                <div className="space-y-2">
                  <MiniLine tone="dark" label="Net Maaş" value={result.netSalary} />
                  <MiniLine tone="dark" label="SGK İşveren Payı" value={result.breakdown.employerContributions.sgkEmployer} />
                  <MiniLine tone="dark" label="İşsizlik İşveren Payı" value={result.breakdown.employerContributions.unemploymentEmployer} />
                </div>
              </DisclosureRow>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function diffDays(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function ihbarWeeksForDays(days: number) {
  if (days < 180) return 2;
  if (days < 540) return 4;
  if (days < 1080) return 6;
  return 8;
}

function SeveranceModule() {
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2026-03-01");
  const [lastGross, setLastGross] = useState(60_000);

  const { severanceGross, severanceStamp, severanceNet, ihbarWeeks, ihbarGross, cappedMonthlyBase } = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) ? diffDays(start, end) : 0;
    const years = days / 365;

    // 2026 H1 kıdem tazminatı tavanı (01.01.2026 - 30.06.2026)
    const severanceCeiling = 64_948.77;
    const monthlyBase = Math.min(lastGross, severanceCeiling);

    // Kıdem: her yıl için 1 aylık brüt (gün bazlı orantı)
    const sevGross = Math.max(0, monthlyBase * years);
    const stamp = sevGross * payrollConfig2026.stampTax; // damga
    const sevNet = Math.max(0, sevGross - stamp);

    const weeks = ihbarWeeksForDays(days);
    const dailyGross = lastGross / 30;
    const ihGross = dailyGross * (weeks * 7);

    return {
      severanceGross: sevGross,
      severanceStamp: stamp,
      severanceNet: sevNet,
      ihbarWeeks: weeks,
      ihbarGross: ihGross,
      cappedMonthlyBase: monthlyBase,
    };
  }, [endDate, lastGross, startDate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="col-span-1 lg:col-span-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <Calculator className="h-4 w-4" />
            Kıdem & İhbar Tazminatı
          </div>
          <div className="mt-1 text-sm text-slate-500">Tarihleri ve son brüt maaşı girin; sonuçlar sağda hesaplanır.</div>

          <div className="mt-6 grid gap-6">
            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-800">İşe Giriş Tarihi</div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-800">İşten Çıkış Tarihi</div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <MoneyField label="Son Brüt Maaş" value={lastGross} onChange={(v) => setLastGross(v ?? 0)} placeholder="Örn: 60.000" />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="text-xs font-semibold text-slate-500">Not</div>
              <div className="mt-2 leading-6">
                Kıdem tazminatı hesabında 01.01.2026 - 30.06.2026 dönemi için tavan uygulanır:
                <span className="ml-1 font-semibold tabular-nums text-slate-800">64.948,77</span>.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="col-span-1 lg:col-span-7">
        <div className="sticky top-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
            <div className="text-sm font-semibold text-blue-900">Kıdem Tazminatı</div>
            <div className="mt-5 grid gap-4 rounded-2xl bg-emerald-50 p-5">
              <div className="text-sm text-slate-500">Net Kıdem Tazminatı</div>
              <div className="text-5xl font-bold tracking-tight text-emerald-600 tabular-nums">
                <AnimatedNumber value={severanceNet} format={formatTL2} />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <MiniLine label="Tavana Esas Aylık Brüt" value={cappedMonthlyBase} />
              <MiniLine label="Brüt Kıdem Tazminatı" value={severanceGross} />
              <MiniLine label="Damga Vergisi Kesintisi" value={severanceStamp} />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="text-sm font-semibold text-white/90">İhbar Tazminatı</div>
            <div className="mt-2 text-sm text-white/70">Hak ediş: {ihbarWeeks} hafta</div>
            <div className="mt-5 text-4xl font-bold tracking-tight text-blue-400 tabular-nums">
              <AnimatedNumber value={ihbarGross} />
            </div>
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white/75">
              İhbar hesabı, kıdeme göre haftalık süreye göre brüt tutar üzerinden hesaplanır.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MvpDashboard() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "severance" ? "SEVERANCE" : "PAYROLL";
  const [tab, setTab] = useState<"PAYROLL" | "SEVERANCE">(initialTab);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Header />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Pill
              active={tab === "PAYROLL"}
              onClick={() => setTab("PAYROLL")}
              icon={<Calculator className="h-4 w-4" />}
              label="Maaş / Bordro Hesaplama"
            />
            <Pill
              active={tab === "SEVERANCE"}
              onClick={() => setTab("SEVERANCE")}
              icon={<HandCoins className="h-4 w-4" />}
              label="Kıdem & İhbar Tazminatı"
            />
          </div>

          
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "PAYROLL" ? (
            <motion.div key="payroll" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
              <PayrollModule />
            </motion.div>
          ) : (
            <motion.div key="severance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
              <SeveranceModule />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

