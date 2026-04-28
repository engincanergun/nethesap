export type IncentiveType = "FIVE_POINT" | "TWO_POINT" | "NONE";

export type TaxBracket = {
  limit: number;
  rate: number;
};

export type PayrollConfig = {
  sgkEmployee: number;
  unemploymentEmployee: number;
  unemploymentEmployer: number;
  stampTax: number;
  sgkCeiling: number;
  sgkFloor: number;
  taxBrackets: TaxBracket[];
  incentives: Record<IncentiveType, number>;
  minimumWageGross: number;
};

export const payrollConfig2026: PayrollConfig = {
  sgkEmployee: 0.14,
  unemploymentEmployee: 0.01,
  unemploymentEmployer: 0.02,
  stampTax: 0.00759,

  sgkCeiling: 150000,
  sgkFloor: 20000,

  taxBrackets: [
    { limit: 190_000, rate: 0.15 },
    { limit: 400_000, rate: 0.2 },
    { limit: 1_500_000, rate: 0.27 },
    { limit: 5_300_000, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.4 },
  ],

  incentives: {
    FIVE_POINT: 0.1675,
    TWO_POINT: 0.1975,
    NONE: 0.2175,
  },

  minimumWageGross: 33030,
};

