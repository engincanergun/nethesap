import Link from "next/link";

type Variant = "solid" | "gradientText";

export function CalculationButton({
  href = "/dashboard",
  label = "Hesaplama",
  variant = "solid",
  className = "",
}: {
  href?: string;
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-4";

  const solid = "bg-slate-900 text-white focus:ring-slate-900/10";

  // Blue-to-slate/black gradient text
  const gradientText =
    "border border-slate-200/70 bg-white/60 text-slate-900 backdrop-blur " +
    "focus:ring-slate-900/10 hover:bg-white/70";

  const textClass =
    variant === "gradientText" ? "nh-gradient-text" : "";

  return (
    <Link href={href} className={[base, variant === "gradientText" ? gradientText : solid, className].filter(Boolean).join(" ")}>
      {variant === "gradientText" ? <span className={textClass}>{label}</span> : label}
    </Link>
  );
}

