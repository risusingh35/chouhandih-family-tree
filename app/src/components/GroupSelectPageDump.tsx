"use client";

import { useState } from "react";
import {
  GROUPS,
  type Group,
  type Clan,
} from "../../../public/data/groups";
import { COLORS } from "../constants/colors";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupSelectPageProps {
  onSelect: (groupId: string, clanId: string) => void;
}
// ─── Vansh Badge ─────────────────────────────────────────────────────────────

const VanshBadge = ({ vansh }: { vansh: Clan["vansh"] }) => {
  console.log("vansh-------------------",vansh);
  
  const style = vansh;
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
        border: `1.5px solid ${hovered ? clan.accent + "55" : COLORS.sand}`,
        background: hovered
          ? `linear-gradient(160deg, #fffdf8 0%, #fdf6ec 100%)`
          : COLORS.cream,
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
                color: COLORS.bark,
                lineHeight: 1.2,
              }}
            >
              {clan.name}
            </h3>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: 11,
                color: COLORS.muted,
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
              color: COLORS.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span aria-hidden style={{ color: COLORS.gold }}>
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
              color: COLORS.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span aria-hidden style={{ color: COLORS.gold }}>
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
                  background: COLORS.warm100,
                  border: `1px solid ${COLORS.warm300}`,
                  fontSize: 10,
                  color: COLORS.umber,
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
            borderTop: `1px solid ${COLORS.sand}`,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: hovered ? clan.accent : COLORS.muted,
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
              background: hovered ? clan.accent : COLORS.warm200,
              color: hovered ? "#fff" : COLORS.umber,
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

        .gs-search:focus { border-color: ${COLORS.gold} !important; box-shadow: 0 0 0 3px rgba(201,169,110,0.18) !important; outline: none; }
        .gs-tab:hover    { background: ${COLORS.warm200} !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 50% -10%, #f0dfc0 0%, ${COLORS.cream} 50%, #faf6f0 100%)`,
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
        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(253,250,245,0.9)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: `1px solid ${COLORS.sand}`,
            borderBottom: `1px solid ${COLORS.sand}`,
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
                color: COLORS.muted,
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
                border: `1.5px solid ${COLORS.sand}`,
                background: COLORS.cream,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: COLORS.bark,
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
                    border: `1.5px solid ${active ? COLORS.gold : COLORS.sand}`,
                    background: active ? COLORS.warm200 : "transparent",
                    color: active ? COLORS.umber : COLORS.muted,
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
              color: COLORS.muted,
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
                color: COLORS.muted,
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
                  border: `1.5px solid ${COLORS.gold}`,
                  background: COLORS.warm100,
                  color: COLORS.umber,
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
      </div>
    </>
  );
};

export default GroupSelectPage;
