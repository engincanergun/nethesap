import type { Metadata } from "next";
import MvpDashboard from "./MvpDashboard";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Hesaplama Modülü — NetHesap",
  description: "Brüt/Net maaş hesapla, kesinti kırılımları ve işveren maliyetini anında gör.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <MvpDashboard />
    </Suspense>
  );
}

