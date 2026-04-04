"use client";
import { useState } from "react";
import PersonModal from "../modal/PersonModal";
import AddChildModal from "../modal/AddChildModal";
import { v4 as uuidv4 } from "uuid";

type Props = { person: any };

const PersonNode = ({ person }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [childrenData, setChildrenData] = useState(person.childrenData || []);
  const [isAddChildOpen, setAddChildOpen] = useState(false);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions((prev) => !prev);
  };

  const handleNodeOptionClick = (actionType: string) => {
    if (actionType === "loadChildren") setChildrenVisible(true);
    if (actionType === "viewDetails") setModalOpen(true);
    if (actionType === "addChild") setAddChildOpen(true);
    setShowActions(false); // hide actions after click
  };

  const handleAddChildSave = (child: any) => {
    setChildrenData((prev: any) => [...prev, child]);
  };

  return (
    <div style={{ textAlign: "center", margin: 20, position: "relative" }}>
      {/* Node */}
      <div
        onClick={handleNodeClick}
        style={{ display: "inline-block", cursor: "pointer" }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `4px solid ${person.gender === "F" ? "red" : "green"}`,
            overflow: "hidden",
            margin: "auto",
          }}
        >
          <img
            src={person.photo}
            alt={person.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ marginTop: 5, fontWeight: "500" }}>{person.name}</div>
      </div>

      {/* Action Buttons Popup */}
      {showActions && (
        <div
          style={{
            position: "absolute",
            top: "-90px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "10px 15px",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 1000,
            minWidth: 140,
          }}
        >
          {["Load Children", "View Details", "Add Child"].map((action) => (
            <button
              key={action}
              onClick={() =>
                handleNodeOptionClick(
                  action === "Load Children"
                    ? "loadChildren"
                    : action === "View Details"
                      ? "viewDetails"
                      : "addChild",
                )
              }
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#f0f0f0",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.background = "#e0e0e0")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.background = "#f0f0f0")
              }
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Children nodes */}
      {childrenVisible && childrenData.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          {childrenData.map((child: any) => (
            <PersonNode key={child.id} person={child} />
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <PersonModal
        person={person}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Add Child Modal */}
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
