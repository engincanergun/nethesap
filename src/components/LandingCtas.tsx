"use client";

import Link from "next/link";
import { track } from "@/components/Analytics";

export function LandingCtas() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        href="/dashboard?tab=payroll"
        onClick={() => track("cta_click", { placement: "hero", label: "Ücretsiz Hesapla" })}
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/50"
      >
        Ücretsiz Hesapla
      </Link>
      <a
        href="#neden"
        onClick={() => track("cta_click", { placement: "hero", label: "Özellikleri Keşfet" })}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50"
      >
        Özellikleri Keşfet
      </a>
    </div>
  );
}

