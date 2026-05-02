import { useMemo } from "react";
import type { Family } from "../types";

const DEFAULT_IMG = "/images/default.jpeg";

const Card = ({ person, persons, isActive, onClick }: any) => {
  const spouse = useMemo(() => {
    return persons.find((p: Family) => p.id === person.spouse?.[0]);
  }, [person, persons]);

  return (
    <div
      onClick={onClick}
      style={{
        padding: 12,
        borderRadius: 14,
        background: "#fff",
        border: "2px solid #ddd",
        minWidth: 150,
        cursor: "pointer",
        boxShadow: isActive
          ? "0 10px 30px rgba(0,0,0,0.2)"
          : "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* PHOTO */}
      <div style={{ position: "relative" }}>
        <img
          src={person.photo || DEFAULT_IMG}
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {/* GENDER */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            fontSize: 14,
          }}
        >
          {person.gender === "M" ? "♂️" : "♀️"}
        </div>

        {/* DECEASED */}
        {!person.isAlive && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid red",
            }}
          />
        )}
      </div>

      {/* NAME */}
      <div style={{ marginTop: 8, fontWeight: 600 }}>{person.name}</div>

      {/* DETAILS */}
      {isActive && (
        <div style={{ fontSize: 12, marginTop: 8 }}>
          <div>DOB: {person.dob || "-"}</div>
          <div>Spouse: {spouse?.name || "-"}</div>
          <div>Children: {person.childrenData?.length || 0}</div>
          <div>Status: {person.isAlive ? "Alive" : "Deceased"}</div>
        </div>
      )}
    </div>
  );
};

export default Card;