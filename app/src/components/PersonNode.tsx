"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import AddChildModal from "../modal/AddChildModal";
import type { PersonNode as PersonNodeType, Family, ParentId } from "../types";
interface Props {
  person: PersonNodeType;
  onAddChild: (parentId: ParentId, child: Family) => void;
  onAddParent: (childId: ParentId, parent: Family) => void;
  vanshId: string;
  persons: Family[];
}

const DEFAULT_IMG = "/images/default.jpeg";

const PersonNode = ({
  person,
  onAddChild,
  onAddParent,
  vanshId,
  persons,
}: Props) => {
  const [showActions, setShowActions] = useState(false);
  const [showChildren, setShowChildren] = useState(true);

  const [childModal, setChildModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  // ─── FIX: outside click ─────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!nodeRef.current?.contains(e.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── spouse resolve ─────────────────
  const spouse = useMemo(() => {
    const spouseIds = person.spouse ?? [];
    if (!spouseIds.length) return null;
    return persons.find((p) => p.id === spouseIds[0]) || null;
  }, [person.spouse, persons]);

  const handleChildSave = (child: Family) => {
    onAddChild(person.id, child);
    setShowChildren(true);
  };

  const handleParentSave = useCallback(
    (parent: Family) => {
      alert("Clicked handleParentSave:" + person.id);
      // onAddParent(person.id, parent);ß
    },
    [person.id, onAddParent],
  );
  console.log("person-----------------------", person);
  const borderColor = person.gender === "F" ? "#e91e63" : "#2196f3";

  // ───────────────── UI ─────────────────
  return (
    <div style={{ textAlign: "center", margin: 24 }}>
      {/* ================= PERSON + SPOUSE ================= */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {/* MAIN PERSON */}
        <Card
          person={person}
          borderColor={borderColor}
          showActions={showActions}
          setShowActions={setShowActions}
          nodeRef={nodeRef}
          onAddChild={() => setChildModal(true)}
          onAddParent={() => setParentModal(true)}
          onToggleChildren={() => setShowChildren((v) => !v)}
          hasChildren={!!person.childrenData?.length}
        />

        {/* SPOUSE */}
        {spouse && (
          <Card
            person={spouse}
            borderColor={spouse.gender === "F" ? "#e91e63" : "#2196f3"}
            isSpouse
          />
        )}
      </div>

      {/* ================= CONNECTOR ================= */}
      {person.childrenData?.length > 0 && (
        <svg width="100%" height="40">
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="40"
            stroke="#bbb"
            strokeWidth="2"
          />
        </svg>
      )}

      {/* ================= CHILDREN ================= */}
      {showChildren && person.childrenData?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {/* horizontal line */}
          <svg width="100%" height="20">
            <line
              x1="10%"
              y1="10"
              x2="90%"
              y2="10"
              stroke="#bbb"
              strokeWidth="2"
            />
          </svg>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
              flexWrap: "wrap",
            }}
          >
            {person.childrenData.map((child) => (
              <PersonNode
                key={child.id}
                person={child}
                onAddChild={onAddChild}
                onAddParent={onAddParent}
                vanshId={vanshId}
                persons={persons}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      <AddChildModal
        isOpen={childModal}
        onClose={() => setChildModal(false)}
        parentId={person.id}
        onSave={handleChildSave}
        vanshId={vanshId}
        persons={persons}
      />

      <AddChildModal
        isOpen={parentModal}
        onClose={() => setParentModal(false)}
        parentId={null}
        onSave={handleParentSave}
        vanshId={vanshId}
        persons={persons}
      />
    </div>
  );
};

export default PersonNode;

const Card = ({
  person,
  borderColor,
  showActions,
  setShowActions,
  nodeRef,
  onAddChild,
  onAddParent,
  onToggleChildren,
  hasChildren,
  isSpouse = false,
}: any) => {
  return (
    <div
      ref={nodeRef}
      onClick={(e) => {
        e.stopPropagation(); // 🔥 FIX double click bug
        setShowActions?.((v: boolean) => !v);
      }}
      style={{
        cursor: isSpouse ? "default" : "pointer",
        padding: 12,
        borderRadius: 16,
        background: "#fff",
        boxShadow: showActions
          ? "0 12px 28px rgba(0,0,0,0.18)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        border: `2px solid ${borderColor}`,
        minWidth: 140,
        position: "relative",
      }}
    >
      {/* PHOTO */}
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          overflow: "hidden",
          margin: "0 auto",
          border: `3px solid ${borderColor}`,
          position: "relative",
        }}
      >
        <img
          src={person.photo || DEFAULT_IMG}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* 🔥 deceased overlay */}
        {!person.isAlive && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid rgba(255,0,0,0.5)",
            }}
          />
        )}
      </div>

      {/* NAME */}
      <div style={{ marginTop: 8, fontWeight: 600 }}>{person.name}</div>

      {/* ACTIONS */}
      {!isSpouse && showActions && (
        <div style={{ marginTop: 10 }}>
          <button onClick={onAddChild}>Add Child</button>
          <button onClick={onAddParent}>Add Parent</button>

          {hasChildren && <button onClick={onToggleChildren}>Toggle</button>}
        </div>
      )}
    </div>
  );
};
