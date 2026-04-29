import type { Metadata } from "next";
import MvpDashboard from "./MvpDashboard";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hesaplama Modülü — NetHesap",
  description: "Brüt/Net maaş hesapla, kesinti kırılımları ve işveren maliyetini anında gör.",
};

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tab = typeof searchParams?.tab === "string" ? searchParams.tab : undefined;
  if (tab === "severance") redirect("/dashboard/severance");
  redirect("/dashboard/payroll");
}

