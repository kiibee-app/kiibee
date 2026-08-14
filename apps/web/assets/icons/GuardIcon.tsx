import COLORS from "@repo/ui/colors";
import type { IconProps } from "./types";

export default function GuardIcon({
  width = 30,
  height = 37,
  color = COLORS.primary.GREEN_100,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 30 37"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M14.8333 1.5L1.5 7.33333V18.1667C1.5 24 7.33333 31.5 14.8333 34.8333C22.3333 33.1667 28.1667 24 28.1667 18.1667V7.33333L14.8333 1.5Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
