import type { Vansh } from "../types";

export const VanshBadge = ({ vansh }: { vansh?: Vansh }) => {
  if (!vansh) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        background: vansh.color?.bg,
        color: vansh.color?.text,
        border: `1px solid ${vansh.color?.border}`,
      }}
    >
      {vansh.name === "Agnivanshi" && "🔥 "}
      {vansh.name === "Chandravanshi" && "🌙 "}
      {vansh.name === "Suryavanshi" && "☀️ "}
      {vansh.name}
    </span>
  );
};