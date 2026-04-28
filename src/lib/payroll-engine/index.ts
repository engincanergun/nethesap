export { payrollConfig2026 } from "@/lib/payroll/config";
export type { PayrollConfig, IncentiveType, TaxBracket } from "@/lib/payroll/config";

import { calculatePayroll } from "@/lib/payroll/calculatePayroll";
import { solveGrossFromNet } from "@/lib/payroll/solveGrossFromNet";

export { calculatePayroll, solveGrossFromNet };

export type { PayrollInput, PayrollResult, PayrollBreakdown } from "@/lib/payroll/types";
export type { SolveGrossFromNetInput, SolveGrossFromNetResult } from "@/lib/payroll/solveGrossFromNet";

export function calculateNetSalary(
  input: import("@/lib/payroll").PayrollInput,
  config: import("@/lib/payroll").PayrollConfig,
) {
  return calculatePayroll(input, config).netSalary;
}

export function calculateEmployerCost(
  input: import("@/lib/payroll").PayrollInput,
  config: import("@/lib/payroll").PayrollConfig,
) {
  return calculatePayroll(input, config).employerCost;
}

