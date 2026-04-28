import type { IncentiveType } from "./config";

export type PayrollInput = {
  grossSalary: number;
  cumulativeTaxBase: number;
  incentiveType: IncentiveType;
  compensation?: {
    mealAllowance?: number;
    transportAllowance?: number;
    bonus?: number;
  };
};

export type PayrollBreakdown = {
  grossTotal: number;
  bases: {
    sgkBase: number;
    taxBase: number;
    cumulativeTaxBasePrev: number;
    cumulativeTaxBaseNew: number;
  };
  employeeDeductions: {
    sgkEmployee: number;
    unemploymentEmployee: number;
  };
  taxes: {
    incomeTaxGross: number;
    minimumWageIncomeTaxExemption: number;
    incomeTaxPayable: number;
    stampTaxGross: number;
    minimumWageStampTaxExemption: number;
    stampTaxPayable: number;
  };
  employerContributions: {
    sgkEmployer: number;
    unemploymentEmployer: number;
    incentiveType: IncentiveType;
    sgkEmployerRateApplied: number;
  };
};

export type PayrollResult = {
  netSalary: number;
  employerCost: number;
  cumulativeTaxBase: number;
  breakdown: PayrollBreakdown;
};

