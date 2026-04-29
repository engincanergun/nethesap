import type { Metadata } from "next";
import { Suspense } from "react";
import MvpDashboard from "../MvpDashboard";

export const metadata: Metadata = {
  title: "Bordro hesaplama",
  description: "Brüt/Net maaş hesapla, kesinti kırılımları ve işveren maliyetini anında gör.",
  alternates: { canonical: "/dashboard/bordro-hesaplama" },
};

export default function BordroHesaplamaPage() {
  return (
    <Suspense fallback={null}>
      <MvpDashboard initialTab="PAYROLL" />
    </Suspense>
  );
}

