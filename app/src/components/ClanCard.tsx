"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Clan } from "../types";
import { COLORS } from "../constants/colors";
import { VanshBadge } from "./VanshBadge";
export const ClanCard = ({ clan }: { clan: Clan }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  if (!clan) return null;
  return (
    <button
      onClick={() => router.push(`/family?vanshId=${clan?.vansh?._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: "unset",
        cursor: "pointer",
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1.5px solid ${hovered ? clan.accent + "55" : COLORS.sand}`,
        background: hovered
          ? `linear-gradient(160deg, #fffdf8 0%, #fdf6ec 100%)`
          : COLORS.cream,
        boxShadow: hovered
          ? `0 16px 40px rgba(44,31,14,0.13)`
          : "0 2px 8px rgba(44,31,14,0.05)",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.22s",
      }}
    >
      <div
        style={{
          height: 4,
          background: clan.accent,
          opacity: hovered ? 1 : 0.6,
        }}
      />

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, color: COLORS.bark }}>{clan.name}</h3>
            <small style={{ color: COLORS.muted }}>{clan.altName}</small>
          </div>
          <VanshBadge vansh={clan.vansh} />
        </div>

        <p style={{ fontSize: 13, color: "#5a4a38" }}>{clan.description}</p>

        <div style={{ fontSize: 12, color: COLORS.muted }}>
          📍 {clan.origin}
        </div>
        <div style={{ fontSize: 12, color: COLORS.muted }}>
          🙏 Kuldevi: {clan.kuldevi}
        </div>

        {clan.subclans?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {clan.subclans.map((s) => (
              <span
                key={s}
                style={{
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: COLORS.warm100,
                  border: `1px solid ${COLORS.warm300}`,
                  fontSize: 10,
                  color: COLORS.umber,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};