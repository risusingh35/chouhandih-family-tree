export const COLORS = {
  cream: "#fffdf8",
  parchment: "#fdf6ec",
  sand: "#ddd4c5",
  gold: "#c9a96e",
  oak: "#a8845a",
  umber: "#7a5c35",
  bark: "#2c1f0e",
  muted: "#9a8570",
  warm100: "rgba(201,169,110,0.10)",
  warm200: "rgba(201,169,110,0.22)",
  warm300: "rgba(201,169,110,0.40)",
} as const;
export const CardStyle = {
  card: {
    fontFamily: "'DM Sans', sans-serif",
    padding: "14px 14px 12px",
    borderRadius: 16,
    background: `linear-gradient(160deg, ${COLORS.parchment} 0%, ${COLORS.sand} 100%)`,
    border: `1.5px solid ${COLORS.gold}`,
    minWidth: 160,
    maxWidth: 200,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    transition: "box-shadow 0.2s, transform 0.2s",
    position: "relative" as const,
  },

  photoWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },

  photoInner: {
    position: "relative" as const,
    width: 72,
    height: 72,
  },

  photo: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover" as const,
    display: "block",
    border: `2.5px solid ${COLORS.oak}`,
    transition: "filter 0.2s, border 0.2s",
  },

  name: {
    textAlign: "center" as const,
    fontWeight: 700,
    fontSize: 14,
    color: COLORS.bark,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
    marginBottom: 4,
  },

  date: {
    textAlign: "center" as const,
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 6,
  },

  detailsBox: {
    background: COLORS.warm100,
    borderRadius: 10,
    padding: "8px 10px",
    marginBottom: 10,
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "3px 0",
    borderBottom: `1px solid ${COLORS.warm200}`,
    fontSize: 12,
  },

  detailLabel: {
    color: COLORS.muted,
    fontWeight: 500,
  } as const,

  detailValue: {
    fontWeight: 600,
    color: COLORS.umber,
  } as const,

  actionGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 5,
  },
} as const;
