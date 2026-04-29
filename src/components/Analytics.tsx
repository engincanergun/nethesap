"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) return;
    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;
    window.gtag("config", gaId, { page_path: pagePath });
  }, [gaId, pathname, searchParams]);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true, send_page_view: false });
        `}
      </Script>
    </>
  );
}

export function track(event: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag("event", event, params ?? {});
}

