"use client";

import { useEffect, useState } from "react";
import GroupSelectPage from "./src/components/GroupSelectPageDump";
import FamilyTreeView from "./src/components/FamilytreeviewDump";
import personsData from "../public/data/family.json";
import type { Family } from "./src/types";

interface Selection {
  groupId: string;
  clanId: string;
}

const C = {
  gold: "#c9a96e",
  oak: "#a8845a",
  umber: "#7a5c35",
  bark: "#2c1f0e",
  sand: "#ddd4c5",
  cream: "#fffdf8",
  muted: "#9a8570",
};

const Breadcrumb = ({
  selection,
  onBack,
}: {
  selection: Selection;
  onBack: () => void;
}) => (
  <div className="bc-container">
    <button
      type="button"
      onClick={onBack}
      aria-label="Back to clan selection"
      className="bc-back-btn"
    >
      ← Clans
    </button>

    <span className="bc-separator">·</span>

    <span className="bc-group">{selection.groupId}</span>

    <span className="bc-arrow">›</span>

    <span className="bc-clan">
      {selection.clanId.charAt(0).toUpperCase() + selection.clanId.slice(1)}
    </span>
  </div>
);

export default function HomePage() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [selectedFamilyGroup, setSelectedFamilyGroup] = useState<Family[]>([]);

  useEffect(() => {
    if (!selection) return;
    const selectedPersons = (personsData as any)[selection.groupId][
      selection.clanId
    ];
    setSelectedFamilyGroup(selectedPersons || []);
  }, [selection]);

  if (!selection) {
    return (
      <GroupSelectPage
        onSelect={(g, c) => setSelection({ groupId: g, clanId: c })}
      />
    );
  }

  return (
    <>
      <FamilyTreeView
        initialPersons={selectedFamilyGroup as Family[]}
        groupSelection={selection}
      />
      <Breadcrumb selection={selection} onBack={() => setSelection(null)} />
    </>
  );
}
