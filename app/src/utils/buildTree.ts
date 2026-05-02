import { saveFamily } from "../apiCallHelper/saveFamily";
import type { ParentId, Family, PersonNode } from "../types";
/**
 * Build Tree (robust version)
 */
export function buildTree(persons: Family[]): PersonNode | null {
  if (!persons.length) return null;

  const map: Record<string, PersonNode> = {};

  // ─── Init ─────────────────────────────
  persons.forEach((p) => {
    map[p.id] = {
      ...p,
      childrenData: [],
      parentData: [],
      spouseData: [],
    };
  });

  // ─── Build Parent + Children ──────────
  persons.forEach((p) => {
    const node = map[p.id];

    // parents
    node.parentData =
      p.parents?.map((id) => map[id]).filter(Boolean) || [];

    // 🔥 derive children (with duplicate protection)
    p.parents?.forEach((parentId) => {
      if (map[parentId]) {
        const parent = map[parentId];

        // ✅ prevent duplicate child push
        if (!parent.childrenData.some((c) => c.id === node.id)) {
          parent.childrenData.push(node);
        }
      }
    });
  });
  // ─── Root Detection ───────────────────
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