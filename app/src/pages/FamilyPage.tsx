"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  buildTree,
  addChildToPersons,
  addParentToPersons,
} from "../utils/buildTree";
import PersonNode from "../components/PersonNode";
import type { Family, ParentId } from "../types";

export const FamilyPage = () => {
  const searchParams = useSearchParams();
  const vanshId = searchParams.get("vanshId") || "";

  const [persons, setPersons] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 GLOBAL ACTIVE NODE (fix double click issue)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // ✅ Add Child (FIX: must trigger re-render)
  const handleAddPerson = useCallback((parentId: ParentId, child: Family) => {
    setPersons((prev) => {
      const cloned = structuredClone(prev); // 🔥 avoid mutation bugs
      return addChildToPersons(cloned, parentId, child);
    });
  }, []);

  // ✅ Add Parent
  const handleAddParent = useCallback((childId: ParentId, parent: Family) => {
    setPersons((prev) => {
      const cloned = structuredClone(prev); // 🔥 avoid mutation bugs
      return addParentToPersons(cloned, childId, parent);
    });
  }, []);

  // ─── Fetch Data ─────────────────────────────────────
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/family?vanshId=${vanshId}`);
        const json = await res.json();

        const formatted: Family[] = (json.data || []).map((f: any) => ({
          id: f._id?.toString(),
          name: f.name,
          gender: f.gender,
          photo: f.photo,
          dob: f.dob,
          death: f.death,
          isMarried: f.isMarried,
          isAlive: f.isAlive,
          isApproved: f.isApproved,

          spouse: Array.isArray(f?.spouse)
            ? f.spouse.map((id: any) => id.toString())
            : [],

          parents: Array.isArray(f?.parents)
            ? f.parents.map((id: any) => id.toString())
            : [],

          children: Array.isArray(f?.children)
            ? f.children.map((id: any) => id.toString())
            : [],
        }));

        setPersons(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
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
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // 🔥 center tree
      }}
    >
      <h1>Family Tree</h1>

      {/* 🔥 TREE ROOT */}
      <div style={{ marginTop: 20 }}>
        <PersonNode
          person={tree}
          onAddChild={handleAddPerson}
          onAddParent={handleAddParent}
          vanshId={vanshId}
          persons={persons}
          activeNodeId={activeNodeId}
          setActiveNodeId={setActiveNodeId}
        />
      </div>
    </div>
  );
};
