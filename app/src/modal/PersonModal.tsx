"use client";

type Props = {
  person: any;
  isOpen: boolean;
  onClose: () => void;
};

const PersonModal = ({ person, isOpen, onClose }: Props) => {
  if (!isOpen || !person) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose} // click outside closes
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          width: 350,
          maxWidth: "90%",
          position: "relative",
          boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()} // prevent modal click close
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        {/* Family Details */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${person.gender === "F" ? "red" : "green"}`,
              margin: "auto",
            }}
          >
            <img
              src={person.photo}
              alt={person.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h2 style={{ marginTop: 10 }}>{person.name}</h2>
        </div>

        <div style={{ marginTop: 10, textAlign: "left" }}>
          <div>
            <strong>Gender:</strong> {person.gender}
          </div>
          <div>
            <strong>DOB:</strong> {person.dob || "N/A"}
          </div>
          {person.death && (
            <div>
              <strong>Death:</strong> {person.death}
            </div>
          )}
          <div>
            <strong>Married:</strong> {person.isMarried ? "Yes" : "No"}
          </div>
          {person.spouseData?.length > 0 && (
            <div>
              <strong>Spouse:</strong>{" "}
              {person.spouseData.map((s: any) => s.name).join(", ")}
            </div>
          )}
          {person.children?.length > 0 && (
            <div>
              <strong>Children ({person.childrenData.length}):</strong>{" "}
              {person.childrenData.map((c: any) => c.name).join(", ")}
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              background: "#0070f3",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;
