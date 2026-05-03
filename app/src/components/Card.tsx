import { useCallback, useMemo, useState } from "react";
import type { Family } from "../types";
import AddChildModal from "../modal/AddChildModal";
import MalaOverlay from "./MalaOverlay";
import GenderBadge from "./GenderBadge";
import ActionBtn from "./ActionBtn";
import { CardStyle, COLORS } from "../constants/colors";

const DEFAULT_IMG = "/images/default.jpeg";
// ─────────────────────────────────────────────────────────────────────────────
const formatDate = (dateStr: string) =>
  dateStr ? new Date(dateStr).toDateString() : "";

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ person, persons, vanshId, onAddChild, onAddParent }: any) => {
  const [childModal, setChildModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const handleChildSave = (child: Family) => {
    onAddChild(person.id, child);
    setShowChildren(true);
  };

  const handleParentSave = useCallback(
    (parent: Family) => onAddParent(person.id, parent),
    [person.id, onAddParent],
  );

  const spouse = useMemo(
    () => persons.find((p: Family) => p.id === person.spouse?.[0]),
    [person, persons],
  );

  const isDeceased = !person.isAlive;

  const details: [string, string | number][] = [
    ["DOB", formatDate(person.dob)],
    ["Spouse", spouse?.name ?? "—"],
    ["DOM", formatDate(person.dom)],
    ["Children", person.childrenData?.length ?? 0],
  ];

  return (
    <div style={CardStyle.card}>
      <button onClick={() => setShowDetails((v) => !v)}>
        {/* ── Photo ─────────────────────────────────────────────────────── */}
        <div style={CardStyle.photoWrapper}>
          <div style={CardStyle.photoInner}>
            <img
              src={person.photo || DEFAULT_IMG}
              alt={person.name}
              style={CardStyle.photo}
            />
            {isDeceased && <MalaOverlay />}
            <GenderBadge gender={person.gender} />
          </div>
        </div>
      </button>

      {/* ── Name ──────────────────────────────────────────────────────── */}
      <div style={CardStyle.name}>{person.name}</div>
      {showDetails && (
        <>
          {/* ── Details ───────────────────────────────────────────────────── */}
          <div style={CardStyle.detailsBox}>
            {details.map(([label, value]) => (
              <div key={label} style={CardStyle.detailRow}>
                <span style={CardStyle.detailLabel}>{label}</span>
                <span style={CardStyle.detailValue}>{value}</span>
              </div>
            ))}
          </div>
          {/* ── DOM ───────────────────────────────────────────────────────── */}
          {person.dod && (
            <div style={CardStyle.date}>DOD: {formatDate(person.dom)}</div>
          )}
          {/* ── Actions ───────────────────────────────────────────────────── */}
          <div style={CardStyle.actionGroup}>
            <ActionBtn
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setChildModal(true);
              }}
              icon="＋"
              label="Add Child"
            />
            <ActionBtn
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setParentModal(true);
              }}
              icon="↑"
              label="Add Parent"
            />
            <ActionBtn
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setShowChildren((v) => !v);
              }}
              icon="⇄"
              label="Toggle Children"
              variant="muted"
            />
          </div>
        </>
      )}

      {/* ── Modals ────────────────────────────────────────────────────── */}
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

export default Card;
