"use client";

import { useMemo, useState } from "react";
import { calculatePayroll, payrollConfig2026, solveGrossFromNet, type IncentiveType } from "@/lib/payroll-engine";
import { PayrollResultsPanel } from "@/components/dashboard/PayrollResultsPanel";
import { SalaryInputForm, type PayrollFormState, estimateCumulativeTaxBasePrevMonth } from "@/components/dashboard/SalaryInputForm";

export default function DashboardClient() {
  const [state, setState] = useState<PayrollFormState>({
    salaryMode: "GROSS",
    grossSalary: 50_000,
    targetNetSalary: 40_000,
    bonus: 0,
    mealAllowance: 0,
    transportAllowance: 0,
    monthIndex: 1,
    cumulativeTaxBaseManual: null,
    incentiveType: "NONE",
  });

  const grossTotalThisMonth = state.grossSalary + state.bonus + state.mealAllowance + state.transportAllowance;
  const cumulativeTaxBaseAuto = useMemo(
    () => estimateCumulativeTaxBasePrevMonth(state.monthIndex, grossTotalThisMonth, payrollConfig2026),
    [grossTotalThisMonth, state.monthIndex],
  );

  const cumulativeTaxBase = state.cumulativeTaxBaseManual ?? cumulativeTaxBaseAuto;

  const resolvedGrossSalary = useMemo(() => {
    if (state.salaryMode === "GROSS") return state.grossSalary;

    const solved = solveGrossFromNet(
      {
        targetNetSalary: state.targetNetSalary,
        cumulativeTaxBase,
        incentiveType: state.incentiveType as IncentiveType,
        compensation: {
          bonus: state.bonus,
          mealAllowance: state.mealAllowance,
          transportAllowance: state.transportAllowance,
        },
      },
      payrollConfig2026,
    );

    return solved.grossSalary;
  }, [
    cumulativeTaxBase,
    state.bonus,
    state.grossSalary,
    state.incentiveType,
    state.mealAllowance,
    state.salaryMode,
    state.targetNetSalary,
    state.transportAllowance,
  ]);

  const result = useMemo(
    () =>
      calculatePayroll(
        {
          grossSalary: resolvedGrossSalary,
          cumulativeTaxBase,
          incentiveType: state.incentiveType,
          compensation: {
            bonus: state.bonus,
            mealAllowance: state.mealAllowance,
            transportAllowance: state.transportAllowance,
          },
        },
        payrollConfig2026,
      ),
    [
      cumulativeTaxBase,
      resolvedGrossSalary,
      state.bonus,
      state.incentiveType,
      state.mealAllowance,
      state.transportAllowance,
    ],
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <div className="text-sm font-semibold text-blue-900">NetHesap</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Hesaplama Modülü</h1>
          <p className="mt-2 max-w-3xl text-slate-500">
            Güvenilir, analitik ve şeffaf bordro hesaplama. Brüt/Net girin, kesinti kırılımlarını ve işveren maliyetini anında görün.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-5">
            <SalaryInputForm
              state={state}
              config={payrollConfig2026}
              onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
            />
          </div>
          <div className="col-span-1 lg:col-span-7">
            <PayrollResultsPanel result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}

