import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A4D2E 0%, #2D7A4F 50%, #0f6c5e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo Circle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "#ffffff",
            padding: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            marginBottom: 32,
          }}
        >
          <img
            src="https://project-98lnv.vercel.app/logo-bina-insani.png"
            width={176}
            height={176}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </div>

        {/* School Name */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Pondok Pesantren Bali Bina Insani
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            margin: "16px 0 0 0",
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          Penerimaan Santri Baru (PSB) Online
        </p>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 40,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 50,
            padding: "10px 28px",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <span style={{ color: "#ffffff", fontSize: 20, fontWeight: 600 }}>
            🎓 Tolerance Islamic Boarding School • Tabanan, Bali
          </span>
        </div>
      </div>
    ),
    size
  );
}
