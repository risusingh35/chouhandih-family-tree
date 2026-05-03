"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { buildTree, addChildToPersons } from "../utils/buildTree";
import PersonNode from "../components/PersonNode";
import type { Family, ParentId } from "../types";

export const FamilyPage = () => {
  const searchParams = useSearchParams();
  const vanshId = searchParams.get("vanshId") || "";

  const [persons, setPersons] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const handleAddPerson = (parentId: ParentId, child: Family) => {
    const addChild = async () => {
      await addChildToPersons(persons, parentId, child);
      setReload((prev) => !prev); // trigger reload to fetch latest data from db
    };
    addChild();
  };

  useEffect(() => {
    const fetchFamily = async () => {
      setLoading(true);

      const res = await fetch(`/api/family?vanshId=${vanshId}`);
      const json = await res.json();

      const formatted: Family[] = (json.data || []).map((f: any) => ({
        id: f._id?.toString(),
        name: f.name,
        gender: f.gender,
        photo: f.photo,
        dob: f.dob,
        dod: f.dod,
        isMarried: f.isMarried,
        isAlive: f.isAlive,
        spouse: Array.isArray(f.spouse) ? f.spouse : [],
        parents: Array.isArray(f.parents) ? f.parents : [],
        children: [],
      }));

      setPersons(formatted);
      setLoading(false);
    };

    fetchFamily();
  }, [vanshId, reload]);

  const tree = useMemo(() => buildTree(persons), [persons]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!tree) return <div>No Data</div>;

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>Family Tree</h1>

      <PersonNode
        person={tree}
        persons={persons}
        vanshId={vanshId}
        onAddChild={handleAddPerson}
        onAddParent={() => {}}
        openCardId={openCardId}
        setOpenCardId={setOpenCardId}
      />
    </div>
  );
};
