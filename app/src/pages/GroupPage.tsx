"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "../constants/colors";
import Ornament from "../components/ui/Ornament";
import { Footer } from "../components/ui/Footer";
import type { IGroup } from "../types";
import Loader from "../components/ui/Loader";

const GroupPage = () => {
  const [group, setGroup] = useState<IGroup | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchGroup = async () => {
      try {
        const res = await fetch("/api/groups");
        const json = await res.json();

        if (mounted) {
          setGroup(json?.data?.[0] || null);
        }
      } catch (err) {
        console.error("Failed to fetch group:", err);
      }
    };

    fetchGroup();

    return () => {
      mounted = false;
    };
  }, []);

  if (!group) return <Loader />;

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(158deg, #fffaf0 0%, #f9efd7 35%, #f4e3b5 65%, #ecd38d 100%)",
      }}
    >
      {/* Decorative Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 15%, rgba(185,140,50,0.10) 0%, transparent 42%),
            radial-gradient(circle at 85% 85%, rgba(140,90,30,0.08) 0%, transparent 42%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 28px,
              rgba(185,140,50,0.045) 28px,
              rgba(185,140,50,0.045) 29px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 28px,
              rgba(185,140,50,0.045) 28px,
              rgba(185,140,50,0.045) 29px
            )
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Inner Border */}
      <div
        style={{
          position: "fixed",
          inset: 12,
          border: "1px solid rgba(185,140,50,0.22)",
          borderRadius: 10,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* HEADER */}
        <section
          style={{
            textAlign: "center",
            paddingTop: 48,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(185,145,60,0.18)",
          }}
        >
          <p
            style={{
              color: "#b27a12",
              letterSpacing: "0.35em",
              fontSize: 11,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            ✦ Vansh Vriksha ✦
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 6.5vw, 72px)",
              color: "#4b2e05",
              margin: 0,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              textShadow: "0 3px 18px rgba(120,80,20,0.16)",
            }}
          >
            {group.name}
          </h1>

          <span
            style={{
              display: "block",
              fontSize: "clamp(17px, 2.5vw, 26px)",
              color: "#9c6b12",
              marginTop: 10,
              letterSpacing: "0.08em",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            {group.nameHindi}
          </span>
        </section>

        {/* HERO */}
        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "52px 24px 36px",
          }}
        >
          <p
            style={{
              margin: "0 auto 24px",
              maxWidth: 560,
              fontSize: 16,
              color: "#5c4a2d",
              lineHeight: 1.9,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            {group.description}
          </p>

          <Ornament width={170} />

          <h2
            style={{
              color: "#5a3608",
              marginTop: 20,
              marginBottom: 12,
              fontSize: "clamp(24px, 3.5vw, 38px)",
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
          >
            {group.hero?.title}
          </h2>

          <p
            style={{
              maxWidth: 540,
              color: "#6b5736",
              fontSize: 15,
              lineHeight: 1.85,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 0,
              fontWeight: 500,
            }}
          >
            {group.hero?.subtitle}
          </p>

          {/* CTA */}
          <button
            onClick={() => router.push(`/clans?groupId=${group._id}`)}
            style={{
              marginTop: 38,
              padding: "14px 40px",
              border: "1.5px solid #c28c1c",
              background:
                "linear-gradient(135deg, #d6a12f 0%, #b27a12 100%)",
              color: "#fff",
              cursor: "pointer",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              boxShadow:
                "0 6px 24px rgba(185,145,60,0.34), 0 2px 6px rgba(0,0,0,0.12)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 10px 32px rgba(185,145,60,0.45), 0 4px 10px rgba(0,0,0,0.14)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(185,145,60,0.34), 0 2px 6px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {group.cta?.label}
          </button>
        </section>

        {/* DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 10vw",
            opacity: 0.5,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#b27a12" }} />
          <span style={{ color: "#b27a12", fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "#b27a12" }} />
        </div>

        {/* DETAILS */}
        <section
          style={{
            padding: "42px 24px 52px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              maxWidth: 700,
              margin: "0 auto",
              color: "#5f4d31",
              fontSize: 15,
              lineHeight: 1.95,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            {group.history}
          </p>

          {/* Highlights */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {group.highlights?.map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  border: "1px solid rgba(185,145,60,0.38)",
                  borderRadius: 24,
                  color: "#8b5e0a",
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  background: "rgba(185,145,60,0.10)",
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Quote */}
          <blockquote
            style={{
              marginTop: 40,
              marginBottom: 0,
              fontStyle: "italic",
              color: "#5a3608",
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.85,
              maxWidth: 620,
              marginLeft: "auto",
              marginRight: "auto",
              borderLeft: "4px solid #c28c1c",
              paddingLeft: 22,
              textAlign: "left",
              background: "rgba(255,255,255,0.22)",
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: 4,
            }}
          >
            "{group.quote?.text}"
            <br />

            <span
              style={{
                fontSize: 12,
                color: "#6f5b3d",
                fontStyle: "normal",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.04em",
                display: "block",
                marginTop: 12,
                fontWeight: 600,
              }}
            >
              — {group.quote?.author}
            </span>
          </blockquote>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default GroupPage;