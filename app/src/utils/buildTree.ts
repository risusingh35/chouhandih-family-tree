// utils/buildTree.ts

import type { ParentId, Family, PersonNode } from "../types";

/**
 * Build Tree (robust version)
 */
export function buildTree(persons: Family[]): PersonNode | null {
  if (!persons.length) return null;

  const map: Record<string, PersonNode> = {};

  // ─── Init ───────────────────────────────────────────
  for (const p of persons) {
    if (!p.id) continue;

    map[p.id] = {
      ...p,
      childrenData: [],
      spouseData: [],
      parentData: [],
    };
  }

  // ─── Link Relations ─────────────────────────────────
  for (const p of persons) {
    if (!p.id || !map[p.id]) continue;

    const node = map[p.id];

    // children
    if (Array.isArray(p.children)) {
      node.childrenData = p.children
        .map((id) => map[id])
        .filter(Boolean);
    }

    // spouse
    if (Array.isArray(p.spouse)) {
      node.spouseData = p.spouse
        .map((id) => map[id])
        .filter(Boolean);
    }

    // parents
    if (Array.isArray(p.parents)) {
      node.parentData = p.parents
        .map((id) => map[id])
        .filter(Boolean);
    }
  }

  // ─── ROOT DETECTION (IMPROVED) ──────────────────────
  const roots = persons.filter(
    (p) => !p.parents || p.parents.length === 0
  );

  if (!roots.length) {
    // fallback → pick any node
    return map[persons[0].id];
  }

  // prefer oldest ancestor (no parent AND has children)
  // find TOP MOST ancestor (no parents)
  const root = persons.find((p) => !p.parents || p.parents.length === 0);

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
export function addChildToPersons(
  persons: Family[],
  parentId: ParentId,
  child: Family
): Family[] {
  if (!parentId || !child?.id) return persons;

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