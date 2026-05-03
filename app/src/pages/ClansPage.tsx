"use client";
import { COLORS } from "../constants/colors";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Group, VanshName } from "../types";
import { ClanCard } from "../components/ClanCard";
import { Loader } from "../components/ui/Loader";

const VANSH_OPTIONS: ("All" | VanshName)[] = [
  "All",
  "Agnivanshi",
  "Chandravanshi",
  "Suryavanshi",
];

// ─── Main Page ────────────────────────────────────────────────────────────
export const ClansPage = () => {
  const searchParams = useSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vanshFilter, setVanshFilter] = useState<"All" | VanshName>("All");
  const hasFetched = useRef(false);

  const rawGroupId = searchParams.get("groupId");
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (rawGroupId) {
      setGroupId(rawGroupId);
    }
  }, [rawGroupId]);

  useEffect(() => {
    if (!groupId || hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/clan?groupId=${groupId}`);
      const json = await res.json();

      setGroup({
        id: groupId,
        name: json.group?.name || "Clans",
        description: json.group?.description || "",
        clans: json.data || [],
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

  if (loading || !group) return  <Loader />;

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
        {filteredClans.map((clan, i) => (
          <ClanCard key={clan?.id + "" + i} clan={clan} />
        ))}
      </div>
    </div>
  );
};
