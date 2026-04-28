import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "radial-gradient(900px 600px at 15% 20%, rgba(37,99,235,0.18), transparent 60%)," +
            "radial-gradient(900px 600px at 85% 25%, rgba(59,130,246,0.14), transparent 60%)," +
            "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 55%, #F8FAFC 100%)",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Bordro artık <span style={{ color: "#2563EB" }}>net.</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 26, color: "#475569", lineHeight: 1.3 }}>
          Net maaş, işveren maliyeti, teşvik ve tazminat hesapları.
        </div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            NH
          </div>
          <div style={{ fontSize: 18, color: "#0F172A", fontWeight: 700 }}>NetHesap</div>
        </div>
      </div>
    ),
    size,
  );
}

