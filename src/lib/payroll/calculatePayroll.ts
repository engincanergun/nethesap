import type { PayrollConfig, TaxBracket } from "./config";
import type { PayrollInput, PayrollResult } from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function assertFiniteNonNegative(n: number, field: string) {
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`Invalid ${field}: must be a finite non-negative number.`);
  }
}

function calcTotalProgressiveTax(cumulativeBase: number, brackets: TaxBracket[]) {
  if (cumulativeBase <= 0) return 0;

  let remaining = cumulativeBase;
  let prevLimit = 0;
  let total = 0;

  for (const { limit, rate } of brackets) {
    const bandSize = Math.max(0, limit - prevLimit);
    const taxableInBand = Math.min(remaining, bandSize);
    if (taxableInBand > 0) total += taxableInBand * rate;
    remaining -= taxableInBand;
    prevLimit = limit;
    if (remaining <= 0) break;
  }

  return total;
}

function calcIncrementalProgressiveTax(
  prevCumulativeBase: number,
  addedTaxBase: number,
  brackets: TaxBracket[],
) {
  if (addedTaxBase <= 0) return 0;
  const prevTotal = calcTotalProgressiveTax(prevCumulativeBase, brackets);
  const nextTotal = calcTotalProgressiveTax(prevCumulativeBase + addedTaxBase, brackets);
  return nextTotal - prevTotal;
}

function calcEmployeeDeductionsForGross(grossTotal: number, config: PayrollConfig) {
  const sgkBase = clamp(grossTotal, config.sgkFloor, config.sgkCeiling);
  const sgkEmployee = sgkBase * config.sgkEmployee;
  const unemploymentEmployee = sgkBase * config.unemploymentEmployee;
  const taxBase = grossTotal - sgkEmployee - unemploymentEmployee;

  return { sgkBase, sgkEmployee, unemploymentEmployee, taxBase };
}

export function calculatePayroll(input: PayrollInput, config: PayrollConfig): PayrollResult {
  assertFiniteNonNegative(input.grossSalary, "grossSalary");
  assertFiniteNonNegative(input.cumulativeTaxBase, "cumulativeTaxBase");

  const meal = input.compensation?.mealAllowance ?? 0;
  const transport = input.compensation?.transportAllowance ?? 0;
  const bonus = input.compensation?.bonus ?? 0;

  assertFiniteNonNegative(meal, "compensation.mealAllowance");
  assertFiniteNonNegative(transport, "compensation.transportAllowance");
  assertFiniteNonNegative(bonus, "compensation.bonus");

  const grossTotal = input.grossSalary + meal + transport + bonus;

  const prevCumulativeTaxBase = input.cumulativeTaxBase;

  const { sgkBase, sgkEmployee, unemploymentEmployee, taxBase } =
    calcEmployeeDeductionsForGross(grossTotal, config);

  const newCumulativeTaxBase = prevCumulativeTaxBase + Math.max(0, taxBase);

  const incomeTaxGross = calcIncrementalProgressiveTax(
    prevCumulativeTaxBase,
    Math.max(0, taxBase),
    config.taxBrackets,
  );

  const minWage = config.minimumWageGross;
  const { taxBase: minWageTaxBase } = calcEmployeeDeductionsForGross(minWage, config);
  const minimumWageIncomeTaxExemption = calcIncrementalProgressiveTax(
    prevCumulativeTaxBase,
    Math.max(0, minWageTaxBase),
    config.taxBrackets,
  );

  const incomeTaxPayable = Math.max(0, incomeTaxGross - minimumWageIncomeTaxExemption);
  const stampTaxGross = grossTotal * config.stampTax;
  const minimumWageStampTaxExemption = minWage * config.stampTax;
  const stampTaxPayable = Math.max(0, stampTaxGross - minimumWageStampTaxExemption);

  const netSalary =
    grossTotal -
    sgkEmployee -
    unemploymentEmployee -
    incomeTaxPayable -
    stampTaxPayable;

  const sgkEmployerRateApplied = config.incentives[input.incentiveType];
  const sgkEmployer = sgkBase * sgkEmployerRateApplied;
  const unemploymentEmployer = sgkBase * config.unemploymentEmployer;
  const employerCost = grossTotal + sgkEmployer + unemploymentEmployer;

  return {
    netSalary: round2(netSalary),
    employerCost: round2(employerCost),
    cumulativeTaxBase: round2(newCumulativeTaxBase),
    breakdown: {
      grossTotal: round2(grossTotal),
      bases: {
        sgkBase: round2(sgkBase),
        taxBase: round2(taxBase),
        cumulativeTaxBasePrev: round2(prevCumulativeTaxBase),
        cumulativeTaxBaseNew: round2(newCumulativeTaxBase),
      },
      employeeDeductions: {
        sgkEmployee: round2(sgkEmployee),
        unemploymentEmployee: round2(unemploymentEmployee),
      },
      taxes: {
        incomeTaxGross: round2(incomeTaxGross),
        minimumWageIncomeTaxExemption: round2(minimumWageIncomeTaxExemption),
        incomeTaxPayable: round2(incomeTaxPayable),
        stampTaxGross: round2(stampTaxGross),
        minimumWageStampTaxExemption: round2(minimumWageStampTaxExemption),
        stampTaxPayable: round2(stampTaxPayable),
      },
      employerContributions: {
        sgkEmployer: round2(sgkEmployer),
        unemploymentEmployer: round2(unemploymentEmployer),
        incentiveType: input.incentiveType,
        sgkEmployerRateApplied: round2(sgkEmployerRateApplied),
      },
    },
  };
}

