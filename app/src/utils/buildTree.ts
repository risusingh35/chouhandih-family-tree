// utils/buildTree.ts

export interface Person {
  id: string;
  name: string;
  gender: "M" | "F";
  photo: string;
  dob: string;
  death: string | null;
  isMarried: boolean;
  isAlive: boolean;
  spouse: string[];
  parents: string[];
  children: string[];
}

export interface PersonNode extends Person {
  childrenData: PersonNode[];
  spouseData: PersonNode[];
}

export function buildTree(persons: Person[]): PersonNode | null {
  if (!persons.length) return null;

  const map: Record<string, PersonNode> = {};

  // Initialize map with empty relation arrays
  persons.forEach((p) => {
    map[p.id] = { ...p, childrenData: [], spouseData: [] };
  });

  // Link children and spouses
  persons.forEach((p) => {
    if (p.children?.length) {
      map[p.id].childrenData = p.children
        .map((cid) => map[cid])
        .filter(Boolean);
    }
    if (p.spouse?.length) {
      map[p.id].spouseData = p.spouse
        .map((sid) => map[sid])
        .filter(Boolean);
    }
  });

  // Roots = persons with no parents
  const roots = persons.filter((p) => !p.parents || p.parents.length === 0);

  // Return first root (male preferred for couple-pair display)
  const maleRoot = roots.find((r) => r.gender === "M");
  const root = maleRoot ?? roots[0];
  return root ? map[root.id] : null;
}

/** Upsert a person into a flat persons array (add if new, replace if existing) */
export function upsertPerson(persons: Person[], incoming: Person): Person[] {
  const idx = persons.findIndex((p) => p.id === incoming.id);
  if (idx === -1) return [...persons, incoming];
  const updated = [...persons];
  updated[idx] = incoming;
  return updated;
}

/** Add a child: insert the child node and append its id to the parent's children list */
export function addChildToPersons(
  persons: Person[],
  parentId: string,
  child: Person
): Person[] {
  const withChild = upsertPerson(persons, child);
  return withChild.map((p) =>
    p.id === parentId
      ? { ...p, children: [...new Set([...p.children, child.id])] }
      : p
  );
}