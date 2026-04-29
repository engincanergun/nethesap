import type { Metadata } from "next";
import { Suspense } from "react";
import MvpDashboard from "../MvpDashboard";

export const metadata: Metadata = {
  title: "Maaş / Bordro Hesaplama — NetHesap",
  description: "Brüt/Net maaş hesapla, kesinti kırılımları ve işveren maliyetini anında gör.",
  alternates: { canonical: "/dashboard/payroll" },
};

export default function PayrollDashboardPage() {
  return (
    <Suspense fallback={null}>
      <MvpDashboard initialTab="PAYROLL" />
    </Suspense>
  );
}

