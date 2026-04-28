"use client";

import { formatNumberTR, parseNumberFromUserInput } from "./format";

export function MoneyInput({
  label,
  value,
  onChange,
  placeholder,
  rightHint = "TL",
  optional,
}: {
  label: string;
  value: number | null;
  onChange: (next: number | null) => void;
  placeholder?: string;
  rightHint?: string;
  optional?: boolean;
}) {
  const displayValue = value === null ? "" : formatNumberTR(value);

  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {optional ? <div className="text-xs text-slate-500">Opsiyonel</div> : null}
      </div>
      <div className="relative">
        <input
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value;
            if (optional && raw.trim() === "") return onChange(null);
            onChange(parseNumberFromUserInput(raw));
          }}
          placeholder={placeholder}
          inputMode="numeric"
          dir="ltr"
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-200 bg-white p-3 pr-12 text-left text-base font-semibold tabular-nums text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
          {rightHint}
        </div>
      </div>
    </label>
  );
}

