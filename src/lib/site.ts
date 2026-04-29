export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = process.env.NODE_ENV === "production" ? "https://nethesap.space" : "http://localhost:3000";

  const candidate = env ? env.replace(/\/+$/, "") : fallback;
  const normalized = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(candidate) ? candidate : `https://${candidate}`;

  try {
    return new URL(normalized).origin;
  } catch {
    return fallback;
  }
}

