import { SVG_XMLNS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";

type DirectionIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
  direction?: "asc" | "desc";
};

export default function DirectionIcon({
  width = 24,
  height = 24,
  color = COLORS.primary.BLACK,
  direction = "asc",
}: DirectionIconProps) {
  const isAsc = direction === "asc";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns={SVG_XMLNS}
      style={{
        transform: isAsc ? "none" : "rotate(180deg)",
        transition: "transform 0.2s ease",
      }}
      aria-hidden="true"
    >
      <path
        d="M12 20V5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 12L12 5L19 12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
