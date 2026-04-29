export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") return "https://nethesap.space";
  return "http://localhost:3000";
}

