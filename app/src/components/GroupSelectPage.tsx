"use client";

import { useState } from "react";
import {
  GROUPS,
  VANSH_COLOR,
  type Group,
  type Clan,
} from "../../../public/data/groups";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupSelectPageProps {
  onSelect: (groupId: string, clanId: string) => void;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  cream: "#fffdf8",
  parchment: "#fdf6ec",
  sand: "#ddd4c5",
  gold: "#c9a96e",
  oak: "#a8845a",
  umber: "#7a5c35",
  bark: "#2c1f0e",
  muted: "#9a8570",
  warm100: "rgba(201,169,110,0.10)",
  warm200: "rgba(201,169,110,0.22)",
  warm300: "rgba(201,169,110,0.40)",
};

// ─── Ornament SVG ─────────────────────────────────────────────────────────────

const Ornament = ({ width = 120 }: { width?: number }) => (
  <svg width={width} height={16} viewBox="0 0 120 16" fill="none" aria-hidden>
    <line
      x1="0"
      y1="8"
      x2="48"
      y2="8"
      stroke={C.gold}
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle
      cx="52"
      cy="8"
      r="2.5"
      fill="none"
      stroke={C.gold}
      strokeWidth="0.8"
      opacity="0.7"
    />
    <circle
      cx="60"
      cy="8"
      r="4"
      fill="none"
      stroke={C.gold}
      strokeWidth="1"
      opacity="0.9"
    />
    <circle
      cx="68"
      cy="8"
      r="2.5"
      fill="none"
      stroke={C.gold}
      strokeWidth="0.8"
      opacity="0.7"
    />
    <line
      x1="72"
      y1="8"
      x2="120"
      y2="8"
      stroke={C.gold}
      strokeWidth="0.8"
      opacity="0.6"
    />
  </svg>
);

// ─── Vansh Badge ─────────────────────────────────────────────────────────────

const VanshBadge = ({ vansh }: { vansh: Clan["vansh"] }) => {
  const style = VANSH_COLOR[vansh];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        fontFamily: "'DM Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      {vansh === "Agnivanshi" && <span aria-hidden>🔥</span>}
      {vansh === "Chandravanshi" && <span aria-hidden>🌙</span>}
      {vansh === "Suryavanshi" && <span aria-hidden>☀️</span>}
      {vansh}
    </span>
  );
};

// ─── Clan Card ────────────────────────────────────────────────────────────────

const ClanCard = ({ clan, onClick }: { clan: Clan; onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Select ${clan.name} clan`}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        borderRadius: 18,
        overflow: "hidden",
        border: `1.5px solid ${hovered ? clan.accent + "55" : C.sand}`,
        background: hovered
          ? `linear-gradient(160deg, #fffdf8 0%, #fdf6ec 100%)`
          : C.cream,
        boxShadow: hovered
          ? `0 16px 40px rgba(44,31,14,0.13), 0 2px 8px rgba(44,31,14,0.06)`
          : "0 2px 8px rgba(44,31,14,0.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.34,1.2,0.64,1)",
      }}
    >
      {/* Accent top bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${clan.accent}aa, ${clan.accent}, ${clan.accent}aa)`,
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.2s",
        }}
      />

      <div
        style={{
          padding: "20px 22px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20,
                fontWeight: 600,
                color: C.bark,
                lineHeight: 1.2,
              }}
            >
              {clan.name}
            </h3>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: 11,
                color: C.muted,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {clan.altName}
            </p>
          </div>
          <VanshBadge vansh={clan.vansh} />
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#5a4a38",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {clan.description}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: C.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span aria-hidden style={{ color: C.gold }}>
              📍
            </span>
            {clan.origin}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: C.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span aria-hidden style={{ color: C.gold }}>
              🙏
            </span>
            Kuldevi: {clan.kuldevi}
          </div>
        </div>

        {/* Sub-clans */}
        {clan.subclans.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {clan.subclans.map((sub: any) => (
              <span
                key={sub}
                style={{
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: C.warm100,
                  border: `1px solid ${C.warm300}`,
                  fontSize: 10,
                  color: C.umber,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {sub}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
            paddingTop: 12,
            borderTop: `1px solid ${C.sand}`,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: hovered ? clan.accent : C.muted,
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.18s",
            }}
          >
            View Family Tree
          </span>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: hovered ? clan.accent : C.warm200,
              color: hovered ? "#fff" : C.umber,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              transition: "all 0.18s",
            }}
            aria-hidden
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
};

// ─── Vansh Filter ─────────────────────────────────────────────────────────────

const VANSH_OPTIONS = [
  "All",
  "Agnivanshi",
  "Chandravanshi",
  "Suryavanshi",
] as const;
type VanshFilter = (typeof VANSH_OPTIONS)[number];

// ─── GroupSelectPage ──────────────────────────────────────────────────────────

const GroupSelectPage = ({ onSelect }: GroupSelectPageProps) => {
  const [activeGroup, setActiveGroup] = useState<Group>(GROUPS[0]);
  const [vanshFilter, setVanshFilter] = useState<VanshFilter>("All");
  const [search, setSearch] = useState("");

  const filteredClans = activeGroup.clans.filter((c) => {
    const matchesVansh = vanshFilter === "All" || c.vansh === vanshFilter;
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.altName.toLowerCase().includes(search.toLowerCase());
    return matchesVansh && matchesSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes gs-fade-in   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gs-banner-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        .gs-search:focus { border-color: ${C.gold} !important; box-shadow: 0 0 0 3px rgba(201,169,110,0.18) !important; outline: none; }
        .gs-tab:hover    { background: ${C.warm200} !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 50% -10%, #f0dfc0 0%, ${C.cream} 50%, #faf6f0 100%)`,
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Hero Banner ──────────────────────────────────────────────────── */}
        <header
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "56px 24px 48px",
            animation: "gs-banner-in 0.5s ease forwards",
          }}
        >
          {/* Decorative top border */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, transparent, ${C.gold}, #c9a96e, ${C.gold}, transparent)`,
            }}
          />

          <p
            style={{
              margin: "0 0 10px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.gold,
            }}
          >
            ✦ Vansh Vriksha ✦
          </p>

          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 600,
              color: C.bark,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {activeGroup.name}
            <span
              style={{
                display: "block",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "0.55em",
                color: C.gold,
                letterSpacing: "0.05em",
              }}
            >
              {activeGroup.nameHindi}
            </span>
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "16px 0",
            }}
          >
            <Ornament width={160} />
          </div>

          <p
            style={{
              margin: "0 auto",
              maxWidth: 520,
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.7,
            }}
          >
            {activeGroup.description}
          </p>

          {/* Group tabs (for future groups) */}
          {GROUPS.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 24,
              }}
            >
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setActiveGroup(g);
                    setVanshFilter("All");
                    setSearch("");
                  }}
                  className="gs-tab"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: `1.5px solid ${activeGroup.id === g.id ? C.gold : C.sand}`,
                    background:
                      activeGroup.id === g.id ? C.warm200 : "transparent",
                    color: activeGroup.id === g.id ? C.umber : C.muted,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.16s",
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(253,250,245,0.9)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: `1px solid ${C.sand}`,
            borderBottom: `1px solid ${C.sand}`,
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div
            style={{ position: "relative", flex: "1 1 200px", maxWidth: 280 }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                color: C.muted,
              }}
            >
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clan…"
              className="gs-search"
              aria-label="Search clans"
              style={{
                width: "100%",
                padding: "9px 12px 9px 34px",
                borderRadius: 10,
                border: `1.5px solid ${C.sand}`,
                background: C.cream,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: C.bark,
                transition: "border-color 0.18s, box-shadow 0.18s",
              }}
            />
          </div>

          {/* Vansh filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {VANSH_OPTIONS.map((v) => {
              const active = vanshFilter === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVanshFilter(v)}
                  className="gs-tab"
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${active ? C.gold : C.sand}`,
                    background: active ? C.warm200 : "transparent",
                    color: active ? C.umber : C.muted,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    letterSpacing: "0.03em",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v === "Agnivanshi" && "🔥 "}
                  {v === "Chandravanshi" && "🌙 "}
                  {v === "Suryavanshi" && "☀️ "}
                  {v}
                </button>
              );
            })}
          </div>

          {/* Count */}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: C.muted,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {filteredClans.length} clan{filteredClans.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Clan Grid ────────────────────────────────────────────────────── */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            padding: "36px 28px 80px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {filteredClans.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {filteredClans.map((clan, i) => (
                <div
                  key={clan.id}
                  style={{
                    animation: `gs-fade-in 0.35s ease forwards`,
                    animationDelay: `${i * 50}ms`,
                    opacity: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <ClanCard
                    clan={clan}
                    onClick={() => onSelect(activeGroup.id, clan.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                color: C.muted,
                animation: "gs-fade-in 0.3s ease forwards",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                }}
              >
                No clans found for "{search}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setVanshFilter("All");
                }}
                style={{
                  marginTop: 14,
                  padding: "9px 18px",
                  borderRadius: 9,
                  border: `1.5px solid ${C.gold}`,
                  background: C.warm100,
                  color: C.umber,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "20px 24px",
            borderTop: `1px solid ${C.sand}`,
            fontSize: 11,
            color: C.muted,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <Ornament width={80} />
          </div>
          वंश वृक्ष — Preserving Heritage, One Family at a Time
        </footer>
      </div>
    </>
  );
};

export default GroupSelectPage;
