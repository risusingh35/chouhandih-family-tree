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
  const [reload, setReload] = useState(false);

  // ✅ Add Child
  const handleAddPerson = (parentId: ParentId, child: Family) => {
    const addChild = async () => {
      await addChildToPersons(persons, parentId, child);
      setReload((prev) => !prev); // trigger reload to fetch latest data from db
    };
    addChild();
  };
  // ✅ Add Parent
  const handleAddParent = useCallback((childId: ParentId, parent: Family) => {
    setPersons((prev) => addParentToPersons([...prev], childId, parent));
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

          spouse: f?.spouse
            ? Array.isArray(f.spouse)
              ? f.spouse.map((id: any) => id.toString())
              : [f.spouse.toString()]
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
  }, [vanshId, reload]);

  // ─── Build Tree ─────────────────────────────────────
  const tree = useMemo(() => buildTree(persons), [persons]);
  console.log("tree-----------------------", tree);
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
        />
      </div>
    </div>
  );
};
