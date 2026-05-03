import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Inject keyframes once
// ─────────────────────────────────────────────────────────────────────────────
const STYLE_ID = "loader-keyframes";

const CSS = `
@keyframes loader-spin {
  to { transform: rotate(360deg); }
}
@keyframes loader-spin-reverse {
  to { transform: rotate(-360deg); }
}
@keyframes loader-pulse {
  0%, 100% { transform: scale(1);   opacity: 1;   }
  50%       { transform: scale(1.3); opacity: 0.6; }
}
@keyframes loader-orbit {
  0%   { transform: rotate(var(--start)) translateX(var(--r)) scale(1);   }
  50%  { transform: rotate(calc(var(--start) + 180deg)) translateX(var(--r)) scale(1.6); }
  100% { transform: rotate(calc(var(--start) + 360deg)) translateX(var(--r)) scale(1);   }
}
@keyframes loader-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

// ─────────────────────────────────────────────────────────────────────────────
// OrbitDot
// ─────────────────────────────────────────────────────────────────────────────
interface OrbitDotProps {
  index:    number;
  total:    number;
  radius:   number;
  size:     number;
  color:    string;
  duration: number;
}

const OrbitDot = ({ index, total, radius, size, color, duration }: OrbitDotProps) => {
  const startDeg = (360 / total) * index;
  const delay    = -(duration / total) * index;

  return (
    <div
      style={{
        position:    "absolute",
        top:         "50%",
        left:        "50%",
        width:       size,
        height:      size,
        marginTop:   -size / 2,
        marginLeft:  -size / 2,
        borderRadius: "50%",
        background:  color,
        boxShadow:   `0 0 ${size * 2}px ${color}`,
        ["--start" as any]: `${startDeg}deg`,
        ["--r"     as any]: `${radius}px`,
        animation:   `loader-orbit ${duration}s ${delay}s linear infinite`,
        willChange:  "transform",
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Loader
// ─────────────────────────────────────────────────────────────────────────────
interface LoaderProps {
  size?:    number;
  text?:    string;
  overlay?: boolean;
}

export const Loader = ({ size = 120, text = "Loading…", overlay = false }: LoaderProps) => {
  useEffect(() => { injectStyles(); }, []);

  const half    = size / 2;
  const palette = ["#a78bfa", "#818cf8", "#38bdf8", "#34d399", "#fb923c"];

  const spinner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

      {/* ── Rings + Dots ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: size, height: size }}>

        {/* Outer ring — slow CW */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#a78bfa", borderRightColor: "#818cf8",
          animation: "loader-spin 2.4s linear infinite",
        }} />

        {/* Middle ring — faster CCW */}
        <div style={{
          position: "absolute", inset: size * 0.1,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#38bdf8", borderBottomColor: "#34d399",
          animation: "loader-spin-reverse 1.6s linear infinite",
        }} />

        {/* Inner dashed ring — slow CW */}
        <div style={{
          position: "absolute", inset: size * 0.22,
          borderRadius: "50%",
          border: "2px dashed rgba(251,146,60,0.45)",
          animation: "loader-spin 3.2s linear infinite",
        }} />

        {/* 4 dots — outer orbit */}
        {[0, 1, 2, 3].map((i) => (
          <OrbitDot key={`o${i}`} index={i} total={4}
            radius={half * 0.82} size={size * 0.08}
            color={palette[i % palette.length]} duration={3} />
        ))}

        {/* 3 dots — inner orbit */}
        {[0, 1, 2].map((i) => (
          <OrbitDot key={`i${i}`} index={-i} total={3}
            radius={half * 0.48} size={size * 0.065}
            color={palette[(i + 2) % palette.length]} duration={2} />
        ))}

        {/* Centre glow pulse */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: size * 0.22, height: size * 0.22,
          marginTop: -(size * 0.22) / 2, marginLeft: -(size * 0.22) / 2,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #c4b5fd, #6d28d9)",
          boxShadow: "0 0 20px rgba(167,139,250,0.7), 0 0 40px rgba(167,139,250,0.3)",
          animation: "loader-pulse 1.4s ease-in-out infinite",
        }} />
      </div>

      {/* ── Shimmer text ─────────────────────────────────────────────── */}
      {text && (
        <div style={{
          fontSize: 13, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.12em", textTransform: "uppercase",
          background: "linear-gradient(90deg, #a78bfa, #38bdf8, #34d399, #a78bfa)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "loader-shimmer 2.4s linear infinite",
        }}>
          {text}
        </div>
      )}
    </div>
  );

  if (!overlay) return spinner;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(10, 8, 20, 0.72)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}>
      {spinner}
    </div>
  );
};

export default Loader;