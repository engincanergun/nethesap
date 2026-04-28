export const trInt = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatNumberTR(n: number) {
  if (!Number.isFinite(n)) return "0";
  return trInt.format(Math.round(n));
}

export function parseNumberFromUserInput(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

