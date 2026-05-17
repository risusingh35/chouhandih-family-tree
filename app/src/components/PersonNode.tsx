"use client";

import React, {
  useMemo,
  useRef,
  useLayoutEffect,
  useState,
  type JSX,
} from "react";
import Card from "./Card";
import type { PersonNode as PersonNodeType, ParentId } from "../types";

interface Props {
  person: PersonNodeType;
  persons: any[];
  onAddChild: (parentId: ParentId, child: any) => void;
  onAddParent: (childId: ParentId, parent: any) => void;
  vanshId: string;
  openCardId: string | null;
  setOpenCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

const LINE = "#c8a55a";
const V_GAP = 44;
const H_GAP = 80;
const MARRIAGE_W = 36;

const PersonNode = ({
  person,
  persons,
  vanshId,
  onAddChild,
  onAddParent,
  openCardId,
  setOpenCardId,
}: Props): JSX.Element => {
  const childrenRowRef = useRef<HTMLDivElement>(null);
  const firstChildRef = useRef<HTMLDivElement>(null);
  const lastChildRef = useRef<HTMLDivElement>(null);
  const [barStyle, setBarStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

const spouse = useMemo(() => person.spouseData?.[0] ?? null, [person.spouseData]);
const children = useMemo(() => person.childrenData ?? [], [person.childrenData]);

  // ── MEASURE horizontal bar from real DOM positions ──────────
  useLayoutEffect(() => {
    if (children.length < 2) {
      setBarStyle(null);
      return;
    }
    const container = childrenRowRef.current;
    const first = firstChildRef.current;
    const last = lastChildRef.current;
    if (!container || !first || !last) return;

    const cRect = container.getBoundingClientRect();
    const fRect = first.getBoundingClientRect();
    const lRect = last.getBoundingClientRect();

    const left = Math.round(fRect.left + fRect.width / 2 - cRect.left);
    const right = Math.round(lRect.left + lRect.width / 2 - cRect.left);
    const width = right - left;

    setBarStyle((prev) => {
      if (prev && prev.left === left && prev.width === width) return prev;
      return { left, width };
    });
  }, [children.length]);

  const renderCard = (p: any) => (
    <Card
      key={p.id}
      person={p}
      persons={persons}
      vanshId={vanshId}
      onClick={() => {}}
      onAddChild={onAddChild}
      onAddParent={onAddParent}
      isOpen={openCardId === p.id}
      onToggle={() => setOpenCardId((prev) => (prev === p.id ? null : p.id))}
    />
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* ── COUPLE ROW ── */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {renderCard(person)}
        {spouse && (
          <>
            <div
              style={{
                width: MARRIAGE_W,
                height: 2,
                background: LINE,
                flexShrink: 0,
              }}
            />
            {renderCard(spouse)}
          </>
        )}
      </div>

      {/* ── CHILDREN ── */}
      {children.length > 0 && (
        <>
          <div
            style={{ width: 2, height: V_GAP, background: LINE, flexShrink: 0 }}
          />

          <div style={{ position: "relative" }}>
            {/* Horizontal bar — position from measured DOM */}
            {children.length > 1 && barStyle && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: barStyle.left,
                  width: barStyle.width,
                  height: 2,
                  background: LINE,
                }}
              />
            )}

            <div
              ref={childrenRowRef}
              style={{ display: "flex", alignItems: "flex-start", gap: H_GAP }}
            >
              {children.map((child: any, i: number) => (
                <div
                  key={child.id}
                  ref={
                    i === 0
                      ? firstChildRef
                      : i === children.length - 1
                        ? lastChildRef
                        : undefined
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: V_GAP,
                      background: LINE,
                      flexShrink: 0,
                    }}
                  />
                  <PersonNode
                    person={child}
                    persons={persons}
                    vanshId={vanshId}
                    onAddChild={onAddChild}
                    onAddParent={onAddParent}
                    openCardId={openCardId}
                    setOpenCardId={setOpenCardId}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonNode;
