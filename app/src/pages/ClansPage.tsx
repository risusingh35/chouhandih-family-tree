"use client";
import { COLORS } from "../constants/colors";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Clan, Group, VanshName, Vansh } from "../types";

// ─── Vansh Badge ─────────────────────────────────────────────────────────
const VanshBadge = ({ vansh }: { vansh?: Vansh }) => {
  if (!vansh) return null;
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
        background: vansh.color?.bg,
        color: vansh.color?.text,
        border: `1px solid ${vansh.color?.border}`,
      }}
    >
      {vansh.name === "Agnivanshi" && "🔥 "}
      {vansh.name === "Chandravanshi" && "🌙 "}
      {vansh.name === "Suryavanshi" && "☀️ "}
      {vansh.name}
    </span>
  );
};

// ─── Clan Card ────────────────────────────────────────────────────────────
const ClanCard = ({ clan }: { clan: Clan }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => router.push(`/clan/${clan.id}`)}
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

// ─── Filters ──────────────────────────────────────────────────────────────
const VANSH_OPTIONS: ("All" | VanshName)[] = [
  "All",
  "Agnivanshi",
  "Chandravanshi",
  "Suryavanshi",
];

// ─── Main Page ────────────────────────────────────────────────────────────
export const ClansPage = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [vanshFilter, setVanshFilter] = useState<"All" | VanshName>("All");

  // ─── Fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      setLoading(true);

      const res = await fetch(`/api/clan?groupId=${groupId}`);
      const json = await res.json();
      const clans: Clan[] = (json.data || [])
    
      setGroup({
        id: groupId,
        name: json.group?.name || "Clans",
        description: json.group?.description || "",
        clans,
      });

      setLoading(false);
    };

    fetchData();
  }, [groupId]);

  // ─── Filter Logic ───────────────────────────────────────────────────────
  const filteredClans = useMemo(() => {
    return (group?.clans || []).filter((c) => {
      const vMatch = vanshFilter === "All" || c.vansh?.name === vanshFilter;

      const sMatch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.altName.toLowerCase().includes(search.toLowerCase());

      return vMatch && sMatch;
    });
  }, [group, search, vanshFilter]);

  if (loading || !group) return <div style={{ padding: 40 }}>Loading...</div>;

  // ─── UI ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: 24 }}>
      <h1>{group.name}</h1>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search clan..."
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${COLORS.sand}`,
        }}
      />

      {/* Vansh Filter */}
      <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
        {VANSH_OPTIONS.map((v) => (
          <button
            key={v}
            onClick={() => setVanshFilter(v)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: `1px solid ${
                vanshFilter === v ? COLORS.gold : COLORS.sand
              }`,
              background: vanshFilter === v ? COLORS.warm200 : "transparent",
              cursor: "pointer",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {filteredClans.map((clan,i) => (
          <ClanCard key={i} clan={clan} />
        ))}
      </div>
    </div>
  );
};
