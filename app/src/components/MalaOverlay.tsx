/** Decorative mala (garland) overlay rendered as an SVG ribbon across the photo */
const MalaOverlay = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      overflow: "hidden",
      zIndex: 1,
      pointerEvents: "none",
    }}
  >
    {/* dark tint */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15, 10, 5, 0.45)",
        borderRadius: "50%",
      }}
    />

    {/* diagonal mala ribbon */}
    <svg
      viewBox="0 0 70 70"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* garland rope */}
      <path
        d="M 5 62 Q 35 48 65 8"
        stroke="#d4a017"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* flower beads along the rope */}
      {[
        [12, 56],
        [24, 50],
        [35, 44],
        [46, 36],
        [57, 24],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {/* petal ring */}
          {[0, 60, 120, 180, 240, 300].map((angle, j) => (
            <circle
              key={j}
              cx={cx + 3.2 * Math.cos((angle * Math.PI) / 180)}
              cy={cy + 3.2 * Math.sin((angle * Math.PI) / 180)}
              r="1.6"
              fill="#f5c842"
              opacity="0.95"
            />
          ))}
          {/* centre dot */}
          <circle cx={cx} cy={cy} r="1.8" fill="#fff" opacity="0.9" />
        </g>
      ))}
    </svg>

    {/* outer ring */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "2.5px solid #8b6914",
        boxSizing: "border-box",
      }}
    />
  </div>
);

export default MalaOverlay;
