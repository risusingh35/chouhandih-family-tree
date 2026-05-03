import { useCallback, useMemo, useState } from "react";
import type { Family } from "../types";
import AddChildModal from "../modal/AddChildModal";
import MalaOverlay from "./MalaOverlay";
import GenderBadge from "./GenderBadge";

const DEFAULT_IMG = "/images/default.jpeg";

/* ─────────────────────────── sub-components ─────────────────────────── */

/* ────────────────────────────── ActionBtn ────────────────────────────── */

const ActionBtn = ({
  onClick,
  icon,
  label,
  variant = "default",
}: {
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  label: string;
  variant?: "default" | "muted";
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 10px",
      borderRadius: 8,
      border: variant === "muted" ? "1px solid #e2e8f0" : "1px solid #cbd5e1",
      background: variant === "muted" ? "#f8fafc" : "#fff",
      color: "#374151",
      fontSize: 12,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background 0.15s, box-shadow 0.15s",
      width: "100%",
      justifyContent: "flex-start",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
      (e.currentTarget as HTMLButtonElement).style.boxShadow =
        "0 1px 4px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background =
        variant === "muted" ? "#f8fafc" : "#fff";
      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
    }}
  >
    <span style={{ fontSize: 13 }}>{icon}</span>
    {label}
  </button>
);

/* ─────────────────────────────── Card ───────────────────────────────── */

const Card = ({ person, persons, vanshId, onAddChild, onAddParent }: any) => {
  const [childModal, setChildModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
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
  const spouse = useMemo(
    () => persons.find((p: Family) => p.id === person.spouse?.[0]),
    [person, persons],
  );

  const isDeceased = !person.isAlive;
  const getFormattedDate = (dateStr: string) => {
    const data = new Date(dateStr);
    return data.toDateString();
  };
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: "14px 14px 12px",
        borderRadius: 16,
        background: "linear-gradient(160deg, #f5f0e8 0%, #ede6d6 100%)",
        border: "1.5px solid #c9b97a",
        minWidth: 160,
        maxWidth: 200,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
      }}
    >
      {/* PHOTO + BADGES */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <img
            src={person.photo || DEFAULT_IMG}
            alt={person.name}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              filter: "grayscale(60%) brightness(0.88)",
              border: "2.5px solid #b8972a",
              transition: "filter 0.2s, border 0.2s",
            }}
          />

          {/* Mala overlay for deceased */}
          {isDeceased && <MalaOverlay />}

          {/* Gender badge — bottom-right of the circle */}
          <GenderBadge gender={person.gender} />
        </div>
      </div>
      {/* NAME */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 14,
          color: "#78350f",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          marginBottom: 4,
        }}
      >
        {person.name}
      </div>
      {/* DOB subtitle always visible */}
      {person.dob && (
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 6,
          }}
        >
          DOB: {getFormattedDate(person.dob)}
        </div>
      )}
      {/* DETAILS (expanded) */}
      {
        <>
          <div
            style={{
              background: "rgba(180,150,60,0.08)",
              borderRadius: 10,
              padding: "8px 10px",
              marginBottom: 10,
            }}
          >
            {[
              ["Spouse", spouse?.name || "—"],
              ["Children", person.childrenData?.length || 0],
              ["Status", person.isAlive ? "Alive" : "Deceased"],
            ].map(([label, value]) => (
              <div
                key={label as string}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "3px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  fontSize: 12,
                  color: "#475569",
                }}
              >
                <span style={{ color: "#94a3b8", fontWeight: 500 }}>
                  {label}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#b45309",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                setChildModal(true);
              }}
              icon="＋"
              label="Add Child"
            />
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                setShowChildren((v) => !v);
              }}
              icon="↑"
              label="Add Parent"
            />
            {
              <ActionBtn
                onClick={(e) => {
                  e.stopPropagation();
                }}
                icon="⇄"
                label="Toggle Children"
                variant="muted"
              />
            }
          </div>
        </>
      }
      {/* MODALS */}
      <AddChildModal
        isOpen={childModal}
        onClose={() => setChildModal(false)}
        parentId={person.id}
        onSave={handleChildSave}
        vanshId={vanshId}
        persons={persons}
      />{" "}
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

export default Card;
