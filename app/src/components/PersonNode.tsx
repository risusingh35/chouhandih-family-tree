"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import Card from "./Card";
import type { PersonNode as PersonNodeType, Family, ParentId } from "../types";
import AddChildModal from "../modal/AddChildModal";

interface Props {
  person: PersonNodeType;
  persons: Family[];
  onAddChild: (parentId: ParentId, child: Family) => void;
  onAddParent: (childId: ParentId, parent: Family) => void;
  vanshId: string;
}

const PersonNode = ({
  person,
  persons,
  vanshId,
  onAddChild,
  onAddParent,
}: Props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  // ✅ GROUP CHILDREN AS COUPLE
  const groupedChildren = useMemo(() => {
    const visited = new Set<string>();

    return person.childrenData.reduce((acc: any[], child) => {
      if (visited.has(child.id)) return acc;

      const spouseId = child.spouse?.[0];
      const spouse = spouseId
        ? person.childrenData.find((c) => c.id === spouseId)
        : null;

      if (spouse && !visited.has(spouse.id)) {
        visited.add(child.id);
        visited.add(spouse.id);

        acc.push({
          type: "couple",
          members: [child, spouse],
        });
      } else {
        visited.add(child.id);
        acc.push({ type: "single", members: [child] });
      }

      return acc;
    }, []);
  }, [person.childrenData]);

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

  return (
    <div ref={nodeRef} style={{ margin: 20 }}>
      {/* PERSON */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
           key={person.id}
          person={person}
          persons={persons}
          vanshId={vanshId}
          onClick={() => setShowActions((v) => !v)}
          onAddChild={onAddChild}
          onAddParent={onAddParent}
        />
      </div>
      {/* CONNECTOR */}
      {person.childrenData?.length > 0 && (
        <div
          style={{ height: 30, borderLeft: "2px solid #ccc", margin: "auto" }}
        />
      )}
      {/* CHILDREN */}
      <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
        {groupedChildren.map((group, i) => {
          if (group.type === "couple") {
            return (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                {group.members.map((m: any) => (
                  <PersonNode
                    key={m.id}
                    person={m}
                    persons={persons}
                    vanshId={vanshId}
                    onAddChild={onAddChild}
                    onAddParent={onAddParent}
                  />
                ))}
              </div>
            );
          }

          return (
            <PersonNode
              key={group.members[0].id}
              person={group.members[0]}
              persons={persons}
              vanshId={vanshId}
              onAddChild={onAddChild}
              onAddParent={onAddParent}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PersonNode;
