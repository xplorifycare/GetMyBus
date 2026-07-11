import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/blogData";

export const alt = "GetMyBus Blog Article";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#070708", color: "#ffffff", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
          Article Not Found
        </div>
      )
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#070708",
          backgroundImage: "linear-gradient(to bottom right, #070708, #050a18, #0b1530)",
          padding: "80px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(10, 132, 255, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            display: "flex",
          }}
        />

        {/* Top bar with tag & branding */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "10px 22px",
              borderRadius: "999px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#0A84FF", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {article.tag}
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "28px", color: "#ffffff", fontWeight: 900, letterSpacing: "-0.03em" }}>
              GetMyBus<span style={{ color: "#0A84FF" }}>.</span>
            </span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", maxWidth: "980px" }}>
          <h1
            style={{
              fontSize: "60px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            {article.headline}
          </h1>
          
          <p style={{ fontSize: "20px", color: "rgba(255, 255, 255, 0.45)", lineHeight: 1.5, margin: 0 }}>
            {article.snippet}
          </p>
        </div>

        {/* Footer with author and CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "40px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(10, 132, 255, 0.1)",
                border: "1px solid rgba(10, 132, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#0A84FF",
                fontWeight: 700,
              }}
            >
              GT
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "18px", color: "#ffffff", fontWeight: 600 }}>{article.author}</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.35)" }}>
                {article.date} · GetMyBus Insights
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#0A84FF",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            <span>Read Article →</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
