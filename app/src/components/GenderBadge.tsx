const GenderBadge = ({ gender }: { gender: string }) => (
  <div
    style={{
      position: "absolute",
      bottom: "-10px",
      left: "10px",
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: gender === "M" ? "#3b82f6" : "#ec4899",
      border: "2px solid #fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      lineHeight: 1,
      boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      zIndex: 4,
    }}
  >
    {gender === "M" ? "♂" : "♀"}
  </div>
);
export default GenderBadge;
