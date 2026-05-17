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

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
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
      try {
        setLoading(true);

        const res = await fetch(`/api/clan?groupId=${groupId}`);
        const json = await res.json();

        setGroup({
          id: groupId,
          name: json.group?.name || "Clans",
          description: json.group?.description || "",
          clans: json.data || [],
        });
      } catch (err) {
        console.error("Failed to fetch clans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  // ─────────────────────────────────────────────────────────────
  // Filter Logic
  // ─────────────────────────────────────────────────────────────
  const filteredClans = useMemo(() => {
    return (group?.clans || []).filter((c) => {
      const vanshMatch = vanshFilter === "All" || c.vansh?.name === vanshFilter;

      const searchMatch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.altName.toLowerCase().includes(search.toLowerCase());

      return vanshMatch && searchMatch;
    });
  }, [group, search, vanshFilter]);

  if (loading || !group) return <Loader />;

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "40px 24px 70px",
        background:
          "linear-gradient(160deg, #fffaf0 0%, #f7ebcd 42%, #edd59a 100%)",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(214,161,47,0.08), transparent 30%),
            radial-gradient(circle at 80% 80%, rgba(214,161,47,0.08), transparent 30%),
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

      {/* Border */}
      <div
        style={{
          position: "fixed",
          inset: 12,
          border: "1px solid rgba(214,161,47,0.20)",
          borderRadius: 10,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 42,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: 12,
              color: "#b27a12",
              fontSize: 12,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            ✦ Rajputana Vansh ✦
          </p>

          <h1
            style={{
              margin: 0,
              color: "#4b2e05",
              fontSize: "clamp(42px, 6vw, 72px)",
              fontWeight: 700,
              lineHeight: 1.05,
              textShadow: "0 4px 18px rgba(120,80,20,0.10)",
            }}
          >
            {group.name}
          </h1>

          <p
            style={{
              maxWidth: 760,
              margin: "18px auto 0",
              color: "#5f4d31",
              fontSize: 15,
              lineHeight: 1.9,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            {group.description}
          </p>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            padding: "22px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.32)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(214,161,47,0.16)",
          }}
        >
          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clan..."
            style={{
              flex: 1,
              minWidth: 260,
              padding: "14px 18px",
              borderRadius: 10,
              border: "1px solid rgba(214,161,47,0.28)",
              outline: "none",
              background: "rgba(255,255,255,0.72)",
              color: "#4b2e05",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          />

          {/* Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {VANSH_OPTIONS.map((v) => {
              const active = vanshFilter === v;

              return (
                <button
                  key={v}
                  onClick={() => setVanshFilter(v)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: active
                      ? "1px solid #c28c1c"
                      : "1px solid rgba(214,161,47,0.20)",
                    background: active
                      ? "linear-gradient(135deg, #d6a12f 0%, #a96d09 100%)"
                      : "rgba(255,255,255,0.60)",
                    color: active ? "#fff" : "#6b4a12",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.25s ease",
                    boxShadow: active
                      ? "0 6px 20px rgba(214,161,47,0.28)"
                      : "none",
                  }}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 34,
            marginTop: 10,
          }}
        >
          {filteredClans.map((clan, i) => (
            <ClanCard key={clan?.id + "" + i} clan={clan} />
          ))}
        </div>

        {/* Empty State */}
        {!filteredClans.length && (
          <div
            style={{
              marginTop: 80,
              textAlign: "center",
              color: "#7a6644",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <h3
              style={{
                marginBottom: 10,
                color: "#5a3608",
                fontSize: 28,
              }}
            >
              No Clans Found
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.8,
              }}
            >
              Try changing your search or vansh filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
