"use client";

import { useRouter } from "next/navigation";

export const HomePage = () => {
  const router = useRouter();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        fontFamily: "'Cormorant Garamond', serif",
        backgroundImage: "url('/images/rajputana-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      {/* <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(0,0,0,0.52))",
        }}
      /> */}

      {/* Golden Pattern */}
      <div
        style={{
          position: "relative",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(214,161,47,0.04) 30px,
              rgba(214,161,47,0.04) 31px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 30px,
              rgba(214,161,47,0.04) 30px,
              rgba(214,161,47,0.04) 31px
            )
          `,
        }}
      />
      {/* Center Button */}
      <button
        onClick={() => router.push("/group")}
        style={{
          position: "relative",
          zIndex: 5,
          padding: "16px 52px",
          border: "1.5px solid #d6a12f",
          borderRadius: 10,
          background: "linear-gradient(135deg, #d6a12f 0%, #a96d09 100%)",
          color: "#fff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow:
            "0 8px 30px rgba(214,161,47,0.35), 0 3px 12px rgba(0,0,0,0.35)",
          transition: "all 0.3s ease",
          animation: "pulseGlow 2s infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
          e.currentTarget.style.boxShadow =
            "0 16px 42px rgba(214,161,47,0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow =
            "0 8px 30px rgba(214,161,47,0.35)";
        }}
      >
        Enter
      </button>

      {/* Animation */}
      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 rgba(214, 161, 47, 0.4),
              0 8px 30px rgba(214, 161, 47, 0.35);
          }

          50% {
            box-shadow: 0 0 24px rgba(214, 161, 47, 0.55),
              0 14px 40px rgba(214, 161, 47, 0.45);
          }

          100% {
            box-shadow: 0 0 0 rgba(214, 161, 47, 0.4),
              0 8px 30px rgba(214, 161, 47, 0.35);
          }
        }
      `}</style>
    </div>
  );
};