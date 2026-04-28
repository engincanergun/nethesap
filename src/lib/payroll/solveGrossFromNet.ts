import type { PayrollConfig } from "./config";
import { calculatePayroll } from "./calculatePayroll";
import type { PayrollInput } from "./types";

export type SolveGrossFromNetInput = Omit<PayrollInput, "grossSalary"> & {
  targetNetSalary: number;
};

export type SolveGrossFromNetResult = {
  grossSalary: number;
  achievedNetSalary: number;
  iterations: number;
};

function assertFiniteNonNegative(n: number, field: string) {
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`Invalid ${field}: must be a finite non-negative number.`);
  }
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Net -> brüt ters hesap.
 *
 * Notlar:
 * - Teorik olarak net, brüt ile artan (monoton) davranır; bu yüzden ikili arama kullanıyoruz.
 * - Çözüm, verilen config + kümülatif matrah + teşvik + ek ödemeler kombinasyonu için geçerlidir.
 */
export function solveGrossFromNet(
  input: SolveGrossFromNetInput,
  config: PayrollConfig,
  opts?: { maxIterations?: number; tolerance?: number; maxGross?: number },
): SolveGrossFromNetResult {
  assertFiniteNonNegative(input.targetNetSalary, "targetNetSalary");

  const maxIterations = opts?.maxIterations ?? 60;
  const tolerance = opts?.tolerance ?? 0.01;

  const meal = input.compensation?.mealAllowance ?? 0;
  const transport = input.compensation?.transportAllowance ?? 0;
  const bonus = input.compensation?.bonus ?? 0;

  assertFiniteNonNegative(meal, "compensation.mealAllowance");
  assertFiniteNonNegative(transport, "compensation.transportAllowance");
  assertFiniteNonNegative(bonus, "compensation.bonus");

  // Target net is for the full grossTotal (grossSalary + extras). We solve for grossSalary.
  const extrasTotal = meal + transport + bonus;

  // Lower bound: cannot be less than 0.
  let lo = 0;
  // Upper bound: allow override; otherwise pick a conservative high cap.
  let hi = opts?.maxGross ?? Math.max(config.sgkCeiling * 10, input.targetNetSalary * 5 + extrasTotal);

  // Quick check: if even hi can't reach target, expand a few times (up to a safe cap).
  const maxHi = config.sgkCeiling * 100;
  let netAtHi = calculatePayroll(
    { ...input, grossSalary: hi, compensation: input.compensation },
    config,
  ).netSalary;
  let expand = 0;
  while (netAtHi + tolerance < input.targetNetSalary && hi < maxHi && expand < 10) {
    hi *= 2;
    netAtHi = calculatePayroll(
      { ...input, grossSalary: hi, compensation: input.compensation },
      config,
    ).netSalary;
    expand += 1;
  }

  let bestGross = hi;
  let bestNet = netAtHi;

  for (let i = 0; i < maxIterations; i += 1) {
    const mid = (lo + hi) / 2;
    const net = calculatePayroll(
      { ...input, grossSalary: mid, compensation: input.compensation },
      config,
    ).netSalary;

    const diff = net - input.targetNetSalary;

    if (Math.abs(diff) < Math.abs(bestNet - input.targetNetSalary)) {
      bestGross = mid;
      bestNet = net;
    }

    if (Math.abs(diff) <= tolerance) {
      return { grossSalary: round2(mid), achievedNetSalary: round2(net), iterations: i + 1 };
    }

    if (diff < 0) lo = mid;
    else hi = mid;
  }

  return { grossSalary: round2(bestGross), achievedNetSalary: round2(bestNet), iterations: maxIterations };
}

