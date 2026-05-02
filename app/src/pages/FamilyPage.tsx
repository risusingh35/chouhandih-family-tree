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

  // ✅ Add Child
  const handleAddPerson = (parentId: ParentId, child: Family) => {
    addChildToPersons(persons, parentId, child);

    // setPersons((prev) => );
  };

  // ✅ Add Parent
  const handleAddParent = useCallback((childId: ParentId, parent: Family) => {
    setPersons((prev) => addParentToPersons(prev, childId, parent));
  }, []);

  // ─── Fetch Data ─────────────────────────────────────
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/family?vanshId=${vanshId}`);
        const json = await res.json();
        console.log("json-------------", json);

        // ✅ normalize Mongo → UI
        const formatted: Family[] = (json.data || []).map((f: any) => ({
          id: f._id?.toString(), // 🔥 IMPORTANT FIX
          name: f.name,
          gender: f.gender,
          photo: f.photo,
          dob: f.dob,
          death: f.death,
          isMarried: f.isMarried,
          isAlive: f.isAlive,
          isApproved: f.isApproved,

          // 🔥 convert ObjectId[] → string[]
          spouse: (f.spouse || []).map((id: any) => id.toString()),
          parents: (f.parents || []).map((id: any) => id.toString()),
          children: (f.children || []).map((id: any) => id.toString()),
        }));

        setPersons(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, []);

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
          onAddChild={handleAddPerson}
          onAddParent={handleAddParent}
          vanshId={vanshId}
          persons={persons}
        />
      </div>
    </div>
  );
};
