/**
 * MalaOverlay
 *
 * Renders a marigold garland that drapes over the top and down both sides
 * of the circular photo frame — exactly like a real Indian memorial photo.
 *
 * The SVG is 92 × 92, positioned at top:-10 / left:-10 so it extends
 * 10 px beyond every edge of the 72 × 72 photo container.
 * The parent div must NOT have overflow:hidden (default is visible — fine).
 */

const MalaOverlay = () => {
  // ── geometry ──────────────────────────────────────────────────────────
  const SVG = 92; // rendered SVG size (px)
  const CX = 46; // centre of the SVG / photo circle
  const CY = 46;
  const PHOTO_R = 36; // matches the 72-px photo
  const ROPE_R = PHOTO_R + 6; // 42 — garland sits just outside the border

  // Arc from lower-left → top → lower-right  (145 ° → 395 °, i.e. 250 ° span)
  // In SVG angle space: 0° = right, 90° = bottom, 180° = left, 270° = top
  // 1. Start anywhere (0° is fine for a full circle)
  const START_DEG = 0;
  const SPAN_DEG = 360;
  const NUM = 18; // number of flowers

  const flowers = Array.from({ length: NUM }, (_, i) => {
    const deg = START_DEG + (SPAN_DEG / (NUM - 1)) * i;
    const rad = (deg * Math.PI) / 180;
    return {
      x: +(CX + ROPE_R * Math.cos(rad)).toFixed(2),
      y: +(CY + ROPE_R * Math.sin(rad)).toFixed(2),
      angle: deg,
      orange: i % 3 !== 2, // mostly orange, occasional yellow
    };
  });

  // Cotton-string path (polyline through every flower centre)
const ropeD = flowers
  .map((f, i) => `${i === 0 ? "M" : "L"} ${f.x} ${f.y}`)
  .join(" ") + " Z"; 

  return (
    <svg
      viewBox={`0 0 ${SVG} ${SVG}`}
      style={{
        position: "absolute",
        top: -10,
        left: -10,
        width: SVG,
        height: SVG,
        pointerEvents: "none",
        zIndex: 3,
        overflow: "visible", // allow petals near edges to render
      }}
      aria-hidden
    >
      {/* ── Cotton string / rope ──────────────────────────────────────── */}
      <path
        d={ropeD}
        stroke="#92400e"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* ── Small leaves between every other flower pair ──────────────── */}
      {flowers.map((f, i) => {
        if (i >= flowers.length - 1 || i % 2 !== 0) return null;
        const nx = flowers[i + 1].x;
        const ny = flowers[i + 1].y;
        const mx = (f.x + nx) / 2;
        const my = (f.y + ny) / 2;
        const angle = Math.atan2(ny - f.y, nx - f.x) * (180 / Math.PI);
        return (
          <ellipse
            key={`leaf-${i}`}
            cx={mx}
            cy={my}
            rx="3"
            ry="1.3"
            fill="#15803d"
            transform={`rotate(${angle.toFixed(1)}, ${mx}, ${my})`}
            opacity="0.82"
          />
        );
      })}

      {/* ── Marigold flowers ─────────────────────────────────────────── */}
      {flowers.map((f, i) => {
        const petalFill = f.orange ? "#fb923c" : "#fbbf24";
        const petalInner = f.orange ? "#f97316" : "#f59e0b";
        const centerFill = f.orange ? "#fef3c7" : "#fffbeb";

        return (
          <g key={i} transform={`translate(${f.x}, ${f.y})`}>
            {/*
              Two rings of petals for depth:
              outer ring (8 petals, r offset 3.8) and
              inner ring (8 petals, r offset 2.2, different angle)
            */}

            {/* Outer petals */}
            {Array.from({ length: 8 }, (_, j) => {
              const a = (j / 8) * 2 * Math.PI;
              return (
                <circle
                  key={`op-${j}`}
                  cx={+(3.8 * Math.cos(a)).toFixed(2)}
                  cy={+(3.8 * Math.sin(a)).toFixed(2)}
                  r="2.1"
                  fill={petalFill}
                  opacity="0.97"
                />
              );
            })}

            {/* Inner petals (rotated 22.5°) */}
            {Array.from({ length: 8 }, (_, j) => {
              const a = (j / 8 + 1 / 16) * 2 * Math.PI;
              return (
                <circle
                  key={`ip-${j}`}
                  cx={+(2.2 * Math.cos(a)).toFixed(2)}
                  cy={+(2.2 * Math.sin(a)).toFixed(2)}
                  r="1.4"
                  fill={petalInner}
                  opacity="0.85"
                />
              );
            })}

            {/* Centre dot */}
            <circle r="1.6" fill={centerFill} />
          </g>
        );
      })}

      {/* ── Rope ends (tiny knot dots) ───────────────────────────────── */}
      <circle
        cx={flowers[0].x}
        cy={flowers[0].y}
        r="1.8"
        fill="#78350f"
        opacity="0.5"
      />
      <circle
        cx={flowers[NUM - 1].x}
        cy={flowers[NUM - 1].y}
        r="1.8"
        fill="#78350f"
        opacity="0.5"
      />
    </svg>
  );
};

export default MalaOverlay;
