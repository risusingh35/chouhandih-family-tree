"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PersonModal from "../modal/PersonModal";
import AddChildModal from "../modal/AddChildModal";
import type { PersonNode as PersonNodeType, Person } from "../utils/buildTree";
import "../../globals.css";

// ─── Palette (unchanged) ─────────────────────────────────

const C = {
  cream: "#fffdf8",
  parchment: "#fdf6ec",
  sand: "#ddd4c5",
  warm100: "rgba(201,169,110,0.15)",
  warm200: "rgba(201,169,110,0.35)",
  gold: "#c9a96e",
  oak: "#a8845a",
  umber: "#7a5c35",
  bark: "#2c1f0e",
  muted: "#9a8570",
  female: "#c97a8a",
  male: "#6a8fa8",
  deceased: "#b0a898",
};

// ─── Actions (unchanged) ─────────────────────────────────

const ACTIONS = [
  { key: "viewDetails", icon: "👁", label: "View Details" },
  { key: "addChild", icon: "＋", label: "Add Child" },
  { key: "showKids", icon: "⌄", label: "Show Children" },
] as const;

type ActionKey = (typeof ACTIONS)[number]["key"];
interface PersonNodeProps {
  person: PersonNodeType;
  onAddPerson: (parentId: string, child: Person) => void;
  depth?: number;
  hasStem?: boolean;
}
// ─── PersonCard (only class added) ───────────────────────

const PersonCard = ({
  person,
  onClick,
  isActive,
}: {
  person: PersonNodeType;
  onClick: () => void;
  isActive: boolean;
}) => {
  const [imgError, setImgError] = useState(false);
  const isFemale = person.gender === "F";
  const isDeceased = !person.isAlive || !!person.death;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`pn-card ${isActive ? "active" : ""}`}
    >
      <div className="pn-avatar-wrapper">
        <div
          className={`pn-avatar ${
            isFemale ? "female" : "male"
          } ${isDeceased ? "deceased" : ""}`}
        >
          {!imgError ? (
            <img
              src={person.photo}
              alt={person.name}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="pn-avatar-fallback" />
          )}
        </div>

        {isDeceased && <div className="pn-deceased">✦</div>}
        <div className="pn-gender">{isFemale ? "♀" : "♂"}</div>
      </div>

      <span className="pn-name">{person.name}</span>
      <span className="pn-dob">DOB {person.dob}</span>
    </button>
  );
};

// ─── ActionPopup (only class added) ──────────────────────

const ActionPopup = ({
  onAction,
  hasChildren,
  childrenVisible,
}: {
  onAction: (key: ActionKey) => void;
  hasChildren: boolean;
  childrenVisible: boolean;
}) => (
  <div role="menu" className="pn-popup">
    <div className="pn-popup-arrow" />

    {ACTIONS.map(({ key, icon, label }) => {
      if (key === "showKids" && !hasChildren) return null;
      const isToggled = key === "showKids" && childrenVisible;

      return (
        <button
          key={key}
          role="menuitem"
          type="button"
          onClick={() => onAction(key)}
          className={`pn-action-btn ${isToggled ? "active" : ""}`}
        >
          <span className="pn-action-icon">
            {key === "showKids" && isToggled ? "⌃" : icon}
          </span>

          {key === "showKids" ? (isToggled ? "Hide Children" : label) : label}
        </button>
      );
    })}
  </div>
);

// ─── PersonNode (logic untouched) ────────────────────────

const PersonNode = ({
  person,
  onAddPerson,
  depth = 0,
  hasStem = false,
}: PersonNodeProps) => {
  const [showActions, setShowActions] = useState(false);
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddChildOpen, setAddChildOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showActions) return;
    const handle = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showActions]);

  const handleAction = useCallback((key: ActionKey) => {
    setShowActions(false);
    if (key === "viewDetails") setModalOpen(true);
    if (key === "addChild") setAddChildOpen(true);
    if (key === "showKids") setChildrenVisible((v) => !v);
  }, []);

  const handleAddChildSave = useCallback(
    (child: Person) => {
      onAddPerson(person.id, child);
      setChildrenVisible(true);
    },
    [person.id, onAddPerson],
  );

  const spouse = person.spouseData?.[0];
  const sharedChildren = person.childrenData ?? [];

  return (
    <div className="pn-node">
      {hasStem && <div className="pn-stem" />}

      <div ref={nodeRef} className="pn-couple">
        <div className="pn-popup-wrapper">
          {showActions && (
            <ActionPopup
              onAction={handleAction}
              hasChildren={sharedChildren.length > 0}
              childrenVisible={childrenVisible}
            />
          )}

          <PersonCard
            person={person}
            onClick={() => setShowActions((v) => !v)}
            isActive={showActions}
          />
        </div>

        {spouse && (
          <>
            <div className="pn-marriage">
              <div className="line" />
              <div className="ring">♥</div>
              <div className="line" />
            </div>

            <PersonCard person={spouse} onClick={() => {}} isActive={false} />
          </>
        )}
      </div>

      {childrenVisible && sharedChildren.length > 0 && (
        <div className="pn-children">
          <div className="pn-stem" />

          <div className="pn-children-row">
            {sharedChildren.map((child) => (
              <PersonNode
                key={child.id}
                person={child}
                onAddPerson={onAddPerson}
                depth={depth + 1}
                hasStem
              />
            ))}
          </div>
        </div>
      )}

      <PersonModal
        person={person}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setAddChildOpen(false)}
        parentId={person.id}
        onSave={handleAddChildSave}
      />
    </div>
  );
};

export default PersonNode;
