"use client";

import { COLORS } from "../../constants/colors";

const Ornament = ({ width = 120 }: { width?: number }) => (
  <svg width={width} height={16} viewBox="0 0 120 16" fill="none" aria-hidden>
    <line
      x1="0"
      y1="8"
      x2="48"
      y2="8"
      stroke={COLORS.gold}
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle
      cx="52"
      cy="8"
      r="2.5"
      fill="none"
      stroke={COLORS.gold}
      strokeWidth="0.8"
      opacity="0.7"
    />
    <circle
      cx="60"
      cy="8"
      r="4"
      fill="none"
      stroke={COLORS.gold}
      strokeWidth="1"
      opacity="0.9"
    />
    <circle
      cx="68"
      cy="8"
      r="2.5"
      fill="none"
      stroke={COLORS.gold}
      strokeWidth="0.8"
      opacity="0.7"
    />
    <line
      x1="72"
      y1="8"
      x2="120"
      y2="8"
      stroke={COLORS.gold}
      strokeWidth="0.8"
      opacity="0.6"
    />
  </svg>
);

export default Ornament;
