// utils/buildTree.ts
export const buildTree = (persons: any[]) => {
  const map: Record<string, any> = {};

  // initialize
  persons.forEach((p) => {
    map[p.id] = { ...p, childrenData: [], spouseData: [] };
  });

  // link children and spouses
  persons.forEach((p) => {
    if (p.children?.length)
      map[p.id].childrenData = p.children.map((cid: string) => map[cid]).filter(Boolean);

    if (p.spouse?.length)
      map[p.id].spouseData = p.spouse.map((sid: string) => map[sid]).filter(Boolean);
  });

  // find root(s)
  const roots = persons.filter((p) => !p.parents || p.parents.length === 0);
  return map[roots[0].id]; // assume one top-level root
};