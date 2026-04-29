import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NetHesap",
    short_name: "NetHesap",
    description: "Türkiye 2026 bordro hesaplama: net, brüt, işveren maliyeti ve detaylı kırılım.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#2563EB",
    lang: "tr",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

