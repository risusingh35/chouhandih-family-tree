"use client";

import FamilyTreeView from "./src/components/Familytreeview";
import personsData from "../public/data/family.json";
import type { Person } from "./src/utils/buildTree";

export default function HomePage() {
  return (
    <FamilyTreeView
      initialPersons={personsData.persons as Person[]}
      storageKey="family-tree-data"
    />
  );
}