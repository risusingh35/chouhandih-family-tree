"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const [showChildren, setShowChildren] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const [childModal, setChildModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  // close actions on outside click
  useEffect(() => {
    if (!showActions) return;
    const handler = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);

  // add child
  const handleChildSave = (child: Family) => {
    onAddChild(person.id, child);
    setShowChildren(true);
  };

  // add parent
  const handleParentSave = useCallback(
    (parent: Family) => {
      onAddParent(person.id, parent);
    },
    [person.id, onAddParent],
  );

  const borderColor = person.gender === "F" ? "#e91e63" : "#2196f3"; // pink / blue

  return (
    <div style={{ textAlign: "center", margin: 20 }}>
      {/* PERSON CARD */}
      <div
        ref={nodeRef}
        onClick={() => setShowActions((v) => !v)}
        style={{
          display: "inline-block",
          cursor: "pointer",
          padding: 10,
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: `2px solid ${borderColor}`,
          transition: "0.2s",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto",
            border: `3px solid ${borderColor}`,
          }}
        >
          <img
            src={person.photo || DEFAULT_IMG}
            alt={person.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* NAME */}
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {person.name}
        </div>

        {/* GENDER ICON */}
        <div style={{ fontSize: 12, color: borderColor }}>
          {person.gender === "F" ? "♀ Female" : "♂ Male"}
        </div>

        {/* ACTIONS */}
        {showActions && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {(person?.parents?.length || 0) > 0 && (
              <button onClick={() => setParentModal(true)}>⬆ Add Parent</button>
            )}
            <button onClick={() => setChildModal(true)}>⬇ Add Child</button>
            <button onClick={() => setShowChildren((v) => !v)}>
              Toggle Children
            </button>
          </div>
        )}
      </div>

      {/* CONNECTOR */}
      {person.childrenData?.length > 0 && (
        <div
          style={{
            width: 2,
            height: 20,
            background: "#999",
            margin: "0 auto",
          }}
        />
      )}

      {/* CHILDREN */}
      {showChildren && person.childrenData?.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 10,
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
      )}

      {/* MODALS */}
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
