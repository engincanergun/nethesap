import { PayrollCalculator } from "@/components/PayrollCalculator";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bordro hesaplama",
  description: "Brüt/Net maaş hesapla, kesinti kırılımları ve işveren maliyetini anında gör.",
  alternates: { canonical: "/app" },
};

export default function AppCalculatorPage() {
  return <PayrollCalculator />;
}

