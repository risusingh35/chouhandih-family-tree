"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PersonModal from "../modal/PersonModal";
import AddChildModal from "../modal/AddChildModal";
import type { PersonNode as PersonNodeType, Person } from "../utils/buildTree";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonNodeProps {
  person: PersonNodeType;
  /** Called when a new child is successfully created */
  onAddPerson: (parentId: string, child: Person) => void;
  /** Depth in the tree (0 = root) */
  depth?: number;
  /** Whether to render the vertical "stem" line down from parent */
  hasStem?: boolean;
}

// ─── Palette (matches AddChildModal) ─────────────────────────────────────────

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
  female: "#c97a8a", // dusty rose
  male: "#6a8fa8", // slate blue
  deceased: "#b0a898",
};

// ─── Action menu items ────────────────────────────────────────────────────────

const ACTIONS = [
  { key: "viewDetails", icon: "👁", label: "View Details" },
  { key: "addChild", icon: "＋", label: "Add Child" },
  { key: "showKids", icon: "⌄", label: "Show Children" },
] as const;

type ActionKey = (typeof ACTIONS)[number]["key"];

// ─── PersonCard ───────────────────────────────────────────────────────────────

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
  const ringColor = isFemale ? C.female : C.male;
  const isDeceased = !person.isAlive || !!person.death;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open actions for ${person.name}`}
      aria-expanded={isActive}
      style={{
        all: "unset",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        padding: "10px 12px",
        borderRadius: 16,
        background: isActive
          ? `linear-gradient(160deg, ${C.cream}, ${C.parchment})`
          : "transparent",
        border: `1.5px solid ${isActive ? C.gold : "transparent"}`,
        boxShadow: isActive
          ? `0 8px 24px rgba(122,92,53,0.14), inset 0 1px 0 rgba(255,255,255,0.9)`
          : "none",
        transition: "all 0.22s cubic-bezier(0.34,1.2,0.64,1)",
        transform: isActive ? "translateY(-2px)" : "none",
        minWidth: 90,
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: `3px solid ${isDeceased ? C.deceased : ringColor}`,
            padding: 3,
            background: C.cream,
            boxShadow: isDeceased
              ? "none"
              : `0 0 0 1px ${ringColor}22, 0 4px 12px ${ringColor}33`,
            transition: "box-shadow 0.2s",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              background: C.parchment,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: isDeceased ? "grayscale(0.7)" : "none",
            }}
          >
            {!imgError ? (
              <img
                src={person.photo}
                alt={person.name}
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                aria-hidden
              >
                <circle cx="15" cy="10" r="6" fill={ringColor} opacity="0.5" />
                <path
                  d="M5 26c0-5.523 4.477-10 10-10s10 4.477 10 10"
                  stroke={ringColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Deceased badge */}
        {isDeceased && (
          <div
            aria-label="Deceased"
            title="Deceased"
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: C.deceased,
              border: `2px solid ${C.cream}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ✦
          </div>
        )}

        {/* Gender pip */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: ringColor,
            border: `2px solid ${C.cream}`,
            fontSize: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {isFemale ? "♀" : "♂"}
        </div>
      </div>

      {/* Name */}
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 13,
          fontWeight: 600,
          color: isDeceased ? C.muted : C.bark,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 90,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {person.name}
      </span>

      {/* DOB */}
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          color: C.muted,
          letterSpacing: "0.04em",
        }}
      >
        b. {person.dob}
      </span>
    </button>
  );
};

// ─── Action Popup ─────────────────────────────────────────────────────────────

const ActionPopup = ({
  onAction,
  hasChildren,
  childrenVisible,
}: {
  onAction: (key: ActionKey) => void;
  hasChildren: boolean;
  childrenVisible: boolean;
}) => (
  <div
    role="menu"
    style={{
      position: "absolute",
      top: -112,
      left: "50%",
      transform: "translateX(-50%)",
      background: `linear-gradient(160deg, ${C.cream} 0%, ${C.parchment} 100%)`,
      border: `1px solid ${C.sand}`,
      borderRadius: 14,
      boxShadow:
        "0 10px 30px rgba(44,31,14,0.18), 0 2px 6px rgba(44,31,14,0.08)",
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      zIndex: 1200,
      minWidth: 152,
      animation: "pn-popup-in 0.18s cubic-bezier(0.34,1.4,0.64,1) forwards",
    }}
  >
    {/* Arrow */}
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: -6,
        left: "50%",
        transform: "translateX(-50%) rotate(45deg)",
        width: 12,
        height: 12,
        background: C.parchment,
        border: `1px solid ${C.sand}`,
        borderTop: "none",
        borderLeft: "none",
      }}
    />

    {ACTIONS.map(({ key, icon, label }) => {
      if (key === "showKids" && !hasChildren) return null;
      const isToggled = key === "showKids" && childrenVisible;

      return (
        <button
          key={key}
          role="menuitem"
          type="button"
          onClick={() => onAction(key)}
          className="pn-action-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 11px",
            borderRadius: 9,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: isToggled ? C.umber : C.bark,
            textAlign: "left",
            transition: "background 0.14s, color 0.14s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = C.warm100;
            (e.currentTarget as HTMLButtonElement).style.color = C.umber;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = isToggled
              ? C.umber
              : C.bark;
          }}
        >
          <span
            aria-hidden
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: C.warm100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {key === "showKids" && isToggled ? "⌃" : icon}
          </span>
          {key === "showKids" ? (isToggled ? "Hide Children" : label) : label}
        </button>
      );
    })}
  </div>
);

// ─── Connector Lines ──────────────────────────────────────────────────────────

const STEM_H = 28; // px — vertical drop from parent to children bar
const LINE_COLOR = C.sand;
const LINE_W = 1.5;

// ─── PersonNode ───────────────────────────────────────────────────────────────

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

  // Close popup on outside click
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

  // Spouse of this person (first spouse for display)
  const spouse = person.spouseData?.[0];

  // Shared children (union of both spouse's childrenData if spouse exists)
  const sharedChildren = person.childrenData ?? [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Vertical stem from parent */}
      {hasStem && (
        <div
          aria-hidden
          style={{
            width: LINE_W,
            height: STEM_H,
            background: LINE_COLOR,
            flexShrink: 0,
          }}
        />
      )}

      {/* Couple row */}
      <div
        ref={nodeRef}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0,
          position: "relative",
        }}
      >
        {/* This person's card */}
        <div style={{ position: "relative" }}>
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

        {/* Marriage connector + spouse */}
        {spouse && (
          <>
            {/* Horizontal marriage line with ring icon */}
            <div
              aria-hidden
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
                gap: 0,
                marginTop: -8,
              }}
            >
              <div
                style={{ width: 16, height: LINE_W, background: LINE_COLOR }}
              />
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `${LINE_W}px solid ${C.gold}`,
                  background: C.cream,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 8,
                  color: C.gold,
                }}
              >
                ♥
              </div>
              <div
                style={{ width: 16, height: LINE_W, background: LINE_COLOR }}
              />
            </div>

            {/* Spouse card */}
            <PersonCard
              person={spouse as PersonNodeType}
              onClick={() => {}} // spouse has its own node at root level
              isActive={false}
            />
          </>
        )}
      </div>

      {/* Children subtree */}
      {childrenVisible && sharedChildren.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Vertical drop from couple to horizontal bar */}
          <div
            aria-hidden
            style={{ width: LINE_W, height: STEM_H, background: LINE_COLOR }}
          />

          {/* Horizontal bar spanning children */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {/* The horizontal rule */}
            {sharedChildren.length > 1 && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: `calc(50% / ${sharedChildren.length})`,
                  right: `calc(50% / ${sharedChildren.length})`,
                  height: LINE_W,
                  background: LINE_COLOR,
                  // cover full span
                  width: `calc(100% - ${100 / sharedChildren.length}%)`,
                  transform:
                    "translateX(calc(50% / " + sharedChildren.length + "))",
                }}
              />
            )}

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

      {/* Modals */}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500;700&display=swap');

        @keyframes pn-popup-in {
          from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default PersonNode;
