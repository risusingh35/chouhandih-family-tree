"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { buildTree } from "../utils/buildTree";
import PersonNode from "../components/PersonNode";
import type { Family } from "../types";

export const FamilyPage = () => {
  const searchParams = useSearchParams();
  const vanshId = searchParams.get("vanshId");

  const [persons, setPersons] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Data ─────────────────────────────────────
  useEffect(() => {
    if (!vanshId) return;

    const fetchFamily = async () => {
      setLoading(true);

      const res = await fetch(`/api/family?vanshId=${vanshId}`);
      const json = await res.json();

      // 🔥 normalize mongo -> UI format
      const formatted: Family[] = (json.data || []).map((f: any) => ({
        id: f._id,
        name: f.name,
        gender: f.gender,
        photo: f.photo,
        dob: f.dob,
        death: f.death,
        isMarried: f.isMarried,
        isAlive: f.isAlive,
        isApproved: f.isApproved,
        spouse: f.spouse || [],
        parents: f.parents || [],
        children: f.children || [],
      }));

      setPersons(formatted);
      setLoading(false);
    };

    fetchFamily();
  }, [vanshId]);

  // ─── Build Tree ─────────────────────────────────────
  const tree = useMemo(() => buildTree(persons), [persons]);

  // ─── Loading ────────────────────────────────────────
  if (loading) {
    return <div style={{ padding: 40 }}>Loading family...</div>;
  }

  // ─── Empty State ────────────────────────────────────
  if (!tree) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No family data found</h2>
      </div>
    );
  }

  // ─── UI ─────────────────────────────────────────────
  return (
    <div style={{ padding: 24 }}>
      <h1>Family Tree</h1>

      <div style={{ marginTop: 20 }}>
        <PersonNode
          person={tree}
          onAddPerson={() => {}}
          depth={0}
          hasStem={false}
        />
      </div>
    </div>
  );
};