import type { Metadata } from "next";
import { Suspense } from "react";
import MvpDashboard from "../MvpDashboard";

export const metadata: Metadata = {
  title: "Kıdem ve ihbar tazminatı hesaplama",
  description: "Kıdem tazminatı (tavanlı) ve ihbar tazminatı hesaplamalarını hızlıca yapın.",
  alternates: { canonical: "/dashboard/kidem-ihbar-tazminati" },
};

export default function KidemIhbarTazminatiPage() {
  return (
    <Suspense fallback={null}>
      <MvpDashboard initialTab="SEVERANCE" />
    </Suspense>
  );
}

