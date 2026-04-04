"use client";
import { useState } from "react";
import PersonModal from "../modal/PersonModal";
import { v4 as uuidv4 } from "uuid";

type Props = { person: any };

const PersonNode = ({ person }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [childrenData, setChildrenData] = useState(person.childrenData || []);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions((prev) => !prev);
  };

  const handleNodeOptionClick = (actionType: string) => {
    if (actionType === "loadChildren") {
      setChildrenVisible(true);
    }
    if (actionType === "viewDetails") {
      setModalOpen(true);
    }
    if (actionType === "addChild") {
      addChildNode();
    }
    setShowActions(false); // hide actions after click
  };
  const addChildNode = () => {
    const name = prompt("Enter child name");
    if (!name) return;
    const newChild = {
      id: uuidv4(),
      name,
      gender: "M",
      photo: "/images/default.jpeg",
      childrenData: [],
      spouseData: [],
      parents: [person.id],
      children: [],
      spouse: [],
      isMarried: false,
    };
    setChildrenData((prev: any) => [...prev, newChild]);
  };

  return (
    <div style={{ textAlign: "center", margin: 20, position: "relative" }}>
      <div
        onClick={handleNodeClick}
        style={{
          display: "inline-block",
          cursor: "pointer",
        }}
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
        <div style={{ marginTop: 5 }}>{person.name}</div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 10,
            zIndex: 1000,
          }}
        >
          <button onClick={() => handleNodeOptionClick("loadChildren")}>
            Load Children
          </button>
          <button onClick={() => handleNodeOptionClick("viewDetails")}>
            View Details
          </button>
          <button onClick={() => handleNodeOptionClick("addChild")}>
            Add Child
          </button>
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

      {/* Modal */}
      <PersonModal
        person={person}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default PersonNode;
