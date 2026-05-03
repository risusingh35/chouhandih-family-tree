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

export default ActionBtn;
