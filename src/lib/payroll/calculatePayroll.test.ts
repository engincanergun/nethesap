import { describe, expect, it } from "vitest";
import { calculatePayroll, payrollConfig2026, solveGrossFromNet } from "@/lib/payroll";

describe("calculatePayroll (Turkey 2026 config-driven)", () => {
  it("minimum wage case: income tax payable should not be negative", () => {
    const result = calculatePayroll(
      {
        grossSalary: payrollConfig2026.minimumWageGross,
        cumulativeTaxBase: 0,
        incentiveType: "NONE",
      },
      payrollConfig2026,
    );

    expect(result.breakdown.taxes.incomeTaxPayable).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.taxes.stampTaxPayable).toBeGreaterThanOrEqual(0);
  });

  it("high salary: SGK base should clamp to ceiling", () => {
    const result = calculatePayroll(
      {
        grossSalary: payrollConfig2026.sgkCeiling * 10,
        cumulativeTaxBase: 0,
        incentiveType: "NONE",
      },
      payrollConfig2026,
    );

    expect(result.breakdown.bases.sgkBase).toBe(payrollConfig2026.sgkCeiling);
  });

  it("tax bracket transition: crossing first limit increases marginal rate portion", () => {
    const baseJustBelow = 189_000;
    const grossA = baseJustBelow / (1 - payrollConfig2026.sgkEmployee - payrollConfig2026.unemploymentEmployee);
    const grossB = grossA + 10_000;

    const a = calculatePayroll(
      { grossSalary: grossA, cumulativeTaxBase: 0, incentiveType: "NONE" },
      payrollConfig2026,
    );
    const b = calculatePayroll(
      { grossSalary: grossB, cumulativeTaxBase: 0, incentiveType: "NONE" },
      payrollConfig2026,
    );

    expect(b.breakdown.taxes.incomeTaxGross).toBeGreaterThan(a.breakdown.taxes.incomeTaxGross);
    expect(b.breakdown.bases.cumulativeTaxBaseNew).toBeGreaterThan(a.breakdown.bases.cumulativeTaxBaseNew);
  });

  it("incentive variations: employer SGK contribution rate should change cost", () => {
    const input = {
      grossSalary: 50_000,
      cumulativeTaxBase: 0,
    } as const;

    const none = calculatePayroll({ ...input, incentiveType: "NONE" }, payrollConfig2026);
    const five = calculatePayroll({ ...input, incentiveType: "FIVE_POINT" }, payrollConfig2026);
    const two = calculatePayroll({ ...input, incentiveType: "TWO_POINT" }, payrollConfig2026);

    expect(five.employerCost).toBeLessThan(two.employerCost);
    expect(two.employerCost).toBeLessThan(none.employerCost);
  });

  it("net-to-gross: solving for net should round-trip close to original gross", () => {
    const originalGross = 75_000;
    const forward = calculatePayroll(
      { grossSalary: originalGross, cumulativeTaxBase: 120_000, incentiveType: "NONE" },
      payrollConfig2026,
    );

    const solved = solveGrossFromNet(
      {
        targetNetSalary: forward.netSalary,
        cumulativeTaxBase: 120_000,
        incentiveType: "NONE",
      },
      payrollConfig2026,
      { tolerance: 0.5 },
    );

    expect(Math.abs(solved.grossSalary - originalGross)).toBeLessThan(250);
  });
});

