import { saveFamily } from "../apiCallHelper/saveFamily";
import type { ParentId, Family, PersonNode } from "../types";
/**
 * Build Tree (robust version)
 */
export function buildTree(persons: Family[]): PersonNode | null {
  if (!persons.length) return null;

  const map: Record<string, PersonNode> = {};

  // ─── Init ──────────────────────────────────────────────────
  persons.forEach((p) => {
    map[p.id] = { ...p, childrenData: [], parentData: [], spouseData: [] };
  });

  // ─── Spouse data ───────────────────────────────────────────
  persons.forEach((p) => {
    map[p.id].spouseData = (p.spouse ?? [])
      .map((id) => map[id])
      .filter(Boolean);
  });

  // ─── Group candidates by parent ───────────────────────────
  const candidatesByParent: Record<string, Family[]> = {};
  persons.forEach((p) => {
    (p.parents ?? []).forEach((parentId) => {
      if (!candidatesByParent[parentId]) candidatesByParent[parentId] = [];
      candidatesByParent[parentId].push(p);
    });
  });

  // ─── Build true children (exclude married-in spouses) ─────
  Object.entries(candidatesByParent).forEach(([parentId, group]) => {
    if (!map[parentId]) return;
    const parent = map[parentId];

    // Find every ID that should be excluded:
    // If two people in this group are mutual spouses → exclude the married-in one
    const toExclude = new Set<string>();

    group.forEach((p) => {
      (p.spouse ?? []).forEach((spouseId) => {
        const partner = group.find((g) => g.id === spouseId);
        if (!partner) return; // spouse not in this parent group → ignore

        // Determine who married in:
        // Male lineage → exclude the female
        // Same gender  → exclude lexicographically larger ID (deterministic)
        if (p.gender === "F" && partner.gender === "M") {
          toExclude.add(p.id);
        } else if (p.gender === "M" && partner.gender === "F") {
          toExclude.add(partner.id);
        } else {
          toExclude.add(p.id > partner.id ? p.id : partner.id);
        }
      });
    });

    // Push only true children
    group.forEach((p) => {
      if (toExclude.has(p.id)) return;
      const node = map[p.id];

      if (!node.parentData?.some((pd) => pd.id === parent.id)) {
        node.parentData?.push(parent);
      }
      if (!parent.childrenData.some((c) => c.id === node.id)) {
        parent.childrenData.push(node);
      }
    });
  });

  // ─── Root ──────────────────────────────────────────────────
  const root = persons.find((p) => !p.parents?.length);
  return root ? map[root.id] : null;
}

/**
 * Upsert Person
 */
export function upsertPerson(persons: Family[], incoming: Family): Family[] {
  if (!incoming?.id) return persons;

  const idx = persons.findIndex((p) => p.id === incoming.id);

  if (idx === -1) return [...persons, incoming];

  const updated = [...persons];
  updated[idx] = { ...updated[idx], ...incoming };

  return updated;
}

/**
 * Add Child
 */
export async function addChildToPersons(
  persons: Family[],
  parentId: ParentId,
  child: Family
): Promise<Family[]> {

  if (!parentId || !child?.id) return persons;
  // save data in db
  await saveFamily(child)

  const withChild = upsertPerson(persons, child);

  return withChild.map((p) => {
    if (p.id === parentId) {
      return {
        ...p,
        children: Array.from(new Set([...(p.children || []), child.id])),
      };
    }

    if (p.id === child.id) {
      return {
        ...p,
        parents: Array.from(new Set([...(p.parents || []), parentId])),
      };
    }

    return p;
  });
}

/**
 * Add Parent (bi-directional)
 */
export function addParentToPersons(
  persons: Family[],
  childId: ParentId,
  parent: Family
): Family[] {
  if (!childId || !parent?.id) return persons;

  const withParent = upsertPerson(persons, parent);

  return withParent.map((p) => {
    // attach parent → child
    if (p.id === childId) {
      return {
        ...p,
        parents: Array.from(new Set([...(p.parents || []), parent.id])),
      };
    }

    // attach child → parent
    if (p.id === parent.id) {
      return {
        ...p,
        children: Array.from(new Set([...(p.children || []), childId])),
      };
    }

    return p;
  });
}