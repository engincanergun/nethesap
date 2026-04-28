"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, HandCoins } from "lucide-react";
import { track } from "@/components/Analytics";

type MenuItem = {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

export function CalculationMenu({
  className = "",
  buttonLabel = "Hesaplama",
}: {
  className?: string;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const items: MenuItem[] = useMemo(
    () => [
      {
        label: "Maaş / Bordro Hesaplama",
        description: "Net maaş, kesintiler ve işveren maliyeti",
        href: "/dashboard?tab=payroll",
        icon: <Calculator className="h-5 w-5" />,
      },
      {
        label: "Kıdem & İhbar Tazminatı",
        description: "Tavanlı kıdem + ihbar hesabı",
        href: "/dashboard?tab=severance",
        icon: <HandCoins className="h-5 w-5" />,
      },
    ],
    [],
  );

  return (
    <div
      className={["relative", className].filter(Boolean).join(" ")}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/dashboard"
        className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200/70 bg-white/60 px-5 text-sm font-semibold text-slate-900 shadow-soft backdrop-blur transition hover:bg-white/70 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
      >
        <span className="nh-gradient-text">{buttonLabel}</span>
      </Link>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px]"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              <div className="px-3 pb-2 pt-2 text-xs font-semibold text-slate-500">Modül seç</div>
              <div className="grid gap-2">
                {items.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => track("select_module", { module: it.href.includes("severance") ? "severance" : "payroll" })}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-sm"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-sm">
                      <span className="text-blue-900">{it.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-slate-900">{it.label}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-500">{it.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

