import { useMemo } from "react";
import type { Family } from "../types";

const DEFAULT_IMG = "/images/default.jpeg";

/* ─────────────────────────── sub-components ─────────────────────────── */

const GenderBadge = ({ gender }: { gender: string }) => (
  <div
    style={{
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: gender === "M" ? "#3b82f6" : "#ec4899",
      border: "2px solid #fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      lineHeight: 1,
      boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      zIndex: 2,
    }}
  >
    {gender === "M" ? "♂" : "♀"}
  </div>
);

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

/* ────────────────────────────── ActionBtn ────────────────────────────── */

const ActionBtn = ({
  onClick,
  icon,
  label,
  variant = "default",
}: {
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  label: string;
  variant?: "default" | "muted";
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 10px",
      borderRadius: 8,
      border: variant === "muted" ? "1px solid #e2e8f0" : "1px solid #cbd5e1",
      background: variant === "muted" ? "#f8fafc" : "#fff",
      color: "#374151",
      fontSize: 12,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background 0.15s, box-shadow 0.15s",
      width: "100%",
      justifyContent: "flex-start",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
      (e.currentTarget as HTMLButtonElement).style.boxShadow =
        "0 1px 4px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background =
        variant === "muted" ? "#f8fafc" : "#fff";
      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
    }}
  >
    <span style={{ fontSize: 13 }}>{icon}</span>
    {label}
  </button>
);

/* ─────────────────────────────── Card ───────────────────────────────── */

const Card = ({ person, persons, onAddChild, onAddParent }: any) => {
  const spouse = useMemo(
    () => persons.find((p: Family) => p.id === person.spouse?.[0]),
    [person, persons],
  );

  const isDeceased = !person.isAlive;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: "14px 14px 12px",
        borderRadius: 16,
        background: isDeceased
          ? "linear-gradient(160deg, #f5f0e8 0%, #ede6d6 100%)"
          : "#ffffff",
        border: isDeceased ? "1.5px solid #c9b97a" : "1.5px solid #e2e8f0",
        minWidth: 160,
        maxWidth: 200,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
      }}
    >
      {/* DECEASED BANNER */}
      {isDeceased && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "linear-gradient(135deg, #78350f, #92400e)",
            color: "#fef3c7",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "2px 7px",
            borderRadius: 20,
            textTransform: "uppercase",
            zIndex: 3,
          }}
        >
          Deceased
        </div>
      )}

      {/* PHOTO + BADGES */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <img
            src={person.photo || DEFAULT_IMG}
            alt={person.name}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              filter: isDeceased ? "grayscale(60%) brightness(0.88)" : "none",
              border: isDeceased
                ? "2.5px solid #b8972a"
                : "2.5px solid #e2e8f0",
              transition: "filter 0.2s, border 0.2s",
            }}
          />

          {/* Mala overlay for deceased */}
          {isDeceased && <MalaOverlay />}

          {/* Gender badge — bottom-right of the circle */}
          <GenderBadge gender={person.gender} />
        </div>
      </div>

      {/* NAME */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 14,
          color: isDeceased ? "#78350f" : "#1e293b",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          marginBottom: 4,
        }}
      >
        {person.name}
      </div>

      {/* DOB subtitle always visible */}
      {person.dob && (
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 6,
          }}
        >
          {person.dob}
        </div>
      )}

      {/* DETAILS (expanded) */}
      {
        <>
          <div
            style={{
              background: isDeceased ? "rgba(180,150,60,0.08)" : "#f8fafc",
              borderRadius: 10,
              padding: "8px 10px",
              marginBottom: 10,
            }}
          >
            {[
              ["Spouse", spouse?.name || "—"],
              ["Children", person.childrenData?.length || 0],
              ["Status", person.isAlive ? "Alive" : "Deceased"],
            ].map(([label, value]) => (
              <div
                key={label as string}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "3px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  fontSize: 12,
                  color: "#475569",
                }}
              >
                <span style={{ color: "#94a3b8", fontWeight: 500 }}>
                  {label}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      label === "Status" && !person.isAlive
                        ? "#b45309"
                        : "#1e293b",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                onAddChild?.();
              }}
              icon="＋"
              label="Add Child"
            />
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                onAddParent?.();
              }}
              icon="↑"
              label="Add Parent"
            />
            {
              <ActionBtn
                onClick={(e) => {
                  e.stopPropagation();
                }}
                icon="⇄"
                label="Toggle Children"
                variant="muted"
              />
            }
          </div>
        </>
      }
    </div>
  );
};

export default Card;
