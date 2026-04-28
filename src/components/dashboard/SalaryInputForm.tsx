"use client";

import type { IncentiveType, PayrollConfig } from "@/lib/payroll-engine";
import { MoneyInput } from "./MoneyInput";
import { SegmentedControl } from "./SegmentedControl";
import { formatNumberTR } from "./format";

export type SalaryMode = "GROSS" | "NET";

export type PayrollFormState = {
  salaryMode: SalaryMode;
  grossSalary: number;
  targetNetSalary: number;

  bonus: number;
  mealAllowance: number;
  transportAllowance: number;

  monthIndex: number; // 1..12
  cumulativeTaxBaseManual: number | null; // null => auto

  incentiveType: IncentiveType;
};

export function estimateCumulativeTaxBasePrevMonth(
  monthIndex: number,
  grossTotalThisMonth: number,
  config: PayrollConfig,
) {
  const monthsBefore = Math.max(0, Math.min(11, monthIndex - 1));
  if (monthsBefore === 0) return 0;

  const sgkBase = Math.min(config.sgkCeiling, Math.max(config.sgkFloor, grossTotalThisMonth));
  const sgkEmployee = sgkBase * config.sgkEmployee;
  const unemploymentEmployee = sgkBase * config.unemploymentEmployee;
  const monthlyTaxBase = Math.max(0, grossTotalThisMonth - sgkEmployee - unemploymentEmployee);

  return monthlyTaxBase * monthsBefore;
}

const MONTHS = [
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
] as const;

export function SalaryInputForm({
  state,
  onChange,
  config,
}: {
  state: PayrollFormState;
  onChange: (patch: Partial<PayrollFormState>) => void;
  config: PayrollConfig;
}) {
  const grossTotalThisMonth = state.grossSalary + state.bonus + state.mealAllowance + state.transportAllowance;
  const estimatedCumulative = estimateCumulativeTaxBasePrevMonth(state.monthIndex, grossTotalThisMonth, config);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-blue-900">Hesaplama Formu</div>
          <div className="mt-1 text-sm text-slate-500">Brüt veya net girin, anında detaylı kırılım alın.</div>
        </div>

        <SegmentedControl
          value={state.salaryMode}
          onChange={(v) => onChange({ salaryMode: v })}
          options={[
            { value: "GROSS", label: "Brüt" },
            { value: "NET", label: "Net" },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6">
        {state.salaryMode === "GROSS" ? (
          <MoneyInput
            label="Brüt Maaş"
            value={state.grossSalary}
            onChange={(v) => onChange({ grossSalary: v ?? 0 })}
            placeholder="Örn: 50.000"
          />
        ) : (
          <MoneyInput
            label="Net Maaş"
            value={state.targetNetSalary}
            onChange={(v) => onChange({ targetNetSalary: v ?? 0 })}
            placeholder="Örn: 40.000"
          />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <MoneyInput label="Prim / Bonus" value={state.bonus} onChange={(v) => onChange({ bonus: v ?? 0 })} placeholder="0" />
          <MoneyInput
            label="Yemek Yardımı"
            value={state.mealAllowance}
            onChange={(v) => onChange({ mealAllowance: v ?? 0 })}
            placeholder="0"
          />
          <MoneyInput
            label="Ulaşım Yardımı"
            value={state.transportAllowance}
            onChange={(v) => onChange({ transportAllowance: v ?? 0 })}
            placeholder="0"
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="text-xs font-semibold text-slate-500">İpucu</div>
            <div className="mt-2 leading-6">
              Kümülatif vergi matrahı boş bırakılırsa, seçtiğiniz aya göre otomatik tahmin edilir.
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <div className="mb-2 text-sm font-medium text-slate-800">Hesaplanacak Ay</div>
            <select
              value={String(state.monthIndex)}
              onChange={(e) => onChange({ monthIndex: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={String(idx + 1)}>
                  {m}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-slate-500">
              Otomatik tahmin: <span className="font-semibold">{formatNumberTR(estimatedCumulative)}</span>
            </div>
          </label>

          <MoneyInput
            label="Kümülatif Vergi Matrahı"
            value={state.cumulativeTaxBaseManual}
            onChange={(v) => onChange({ cumulativeTaxBaseManual: v })}
            placeholder={`Otomatik: ${formatNumberTR(estimatedCumulative)}`}
            optional
          />
        </div>

        <label className="block">
          <div className="mb-2 text-sm font-medium text-slate-800">Teşvik Seçimi</div>
          <select
            value={state.incentiveType}
            onChange={(e) => onChange({ incentiveType: e.target.value as IncentiveType })}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="FIVE_POINT">5 Puanlık İndirim</option>
            <option value="TWO_POINT">2 Puanlık İndirim</option>
            <option value="NONE">Teşviksiz</option>
          </select>
          <div className="mt-2 text-xs text-slate-500">İşveren SGK oranı seçime göre uygulanır.</div>
        </label>
      </div>
    </section>
  );
}

