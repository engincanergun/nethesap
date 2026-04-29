import type { Metadata } from "next";
import { Suspense } from "react";
import MvpDashboard from "../MvpDashboard";

export const metadata: Metadata = {
  title: "Kıdem & İhbar Tazminatı — NetHesap",
  description: "Kıdem tazminatı (tavanlı) ve ihbar tazminatı hesaplamalarını hızlıca yapın.",
  alternates: { canonical: "/dashboard/severance" },
};

export default function SeveranceDashboardPage() {
  return (
    <Suspense fallback={null}>
      <MvpDashboard initialTab="SEVERANCE" />
    </Suspense>
  );
}

