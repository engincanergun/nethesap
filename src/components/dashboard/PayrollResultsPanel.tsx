"use client";

import type { PayrollResult } from "@/lib/payroll-engine";
import { formatNumberTR } from "./format";

function Row({
  label,
  value,
  valueClassName = "text-slate-800",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${valueClassName}`}>{value}</div>
    </div>
  );
}

export function PayrollResultsPanel({ result }: { result: PayrollResult }) {
  const totalDeductions =
    result.breakdown.employeeDeductions.sgkEmployee +
    result.breakdown.employeeDeductions.unemploymentEmployee +
    result.breakdown.taxes.incomeTaxPayable +
    result.breakdown.taxes.stampTaxPayable;

  return (
    <div className="sticky top-8 space-y-6">
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-blue-900">Özet</div>
        <div className="mt-4">
          <div className="text-sm text-slate-500">Net Maaş</div>
          <div className="mt-2 text-5xl font-bold tracking-tight text-emerald-600 tabular-nums">
            {formatNumberTR(result.netSalary)}
          </div>
        </div>
        <div className="mt-5 border-t border-slate-100 pt-4">
          <Row label="Brüt Toplam" value={formatNumberTR(result.breakdown.grossTotal)} />
          <Row label="Kümülatif Matrah" value={formatNumberTR(result.breakdown.bases.cumulativeTaxBaseNew)} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-blue-900">İşçi Kesintileri</div>
        <div className="mt-4 divide-y divide-slate-100">
          <Row label="SGK (İşçi)" value={formatNumberTR(result.breakdown.employeeDeductions.sgkEmployee)} />
          <Row label="İşsizlik (İşçi)" value={formatNumberTR(result.breakdown.employeeDeductions.unemploymentEmployee)} />
          <Row label="Gelir Vergisi" value={formatNumberTR(result.breakdown.taxes.incomeTaxPayable)} />
          <Row label="Damga Vergisi" value={formatNumberTR(result.breakdown.taxes.stampTaxPayable)} />
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <Row
            label="Toplam Kesinti"
            value={formatNumberTR(totalDeductions)}
            valueClassName="text-slate-900"
          />
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Gelir vergisi, asgari ücret istisnası düşülerek hesaplanır.
        </div>
      </section>

      <section className="rounded-2xl bg-slate-900 p-6 shadow-sm">
        <div className="text-sm font-semibold text-white/90">İşveren Maliyeti</div>
        <div className="mt-4 divide-y divide-white/10">
          <Row
            label="SGK (İşveren)"
            value={formatNumberTR(result.breakdown.employerContributions.sgkEmployer)}
            valueClassName="text-white"
          />
          <Row
            label="İşsizlik (İşveren)"
            value={formatNumberTR(result.breakdown.employerContributions.unemploymentEmployer)}
            valueClassName="text-white"
          />
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
          <Row
            label="Toplam İşveren Maliyeti"
            value={formatNumberTR(result.employerCost)}
            valueClassName="text-blue-400"
          />
        </div>
      </section>
    </div>
  );
}

