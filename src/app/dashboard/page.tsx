import { redirect } from "next/navigation";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tab = typeof searchParams?.tab === "string" ? searchParams.tab : undefined;
  if (tab === "severance") redirect("/dashboard/kidem-ihbar-tazminati");
  redirect("/dashboard/bordro-hesaplama");
}

