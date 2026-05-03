import Ornament from "./Ornament";
import { COLORS } from "../../constants/colors";
export const Footer = () => {
  return (
       <footer
          style={{
            textAlign: "center",
            padding: "20px 24px",
            borderTop: `1px solid ${COLORS.sand}`,
            fontSize: 11,
            color: COLORS.muted,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          वंश वृक्ष — Preserving Heritage, One Family at a Time
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <Ornament width={80} />
          </div>
        </footer>
  );
};
