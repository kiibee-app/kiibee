import COLORS from "@repo/ui/colors";
import type { IconProps } from "./types";

export default function StreamingIcon({
  width = 25,
  height = 27,
  color = COLORS.primary.GREEN_100,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 25 27"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M1.5 23.5823V3.41772C1.4999 3.08039 1.59252 2.749 1.76853 2.45702C1.94453 2.16505 2.19768 1.92281 2.50242 1.75478C2.80715 1.58675 3.15268 1.49887 3.50412 1.50001C3.85556 1.50116 4.20046 1.59129 4.504 1.7613L22.51 11.8455C22.8113 12.0144 23.0612 12.2561 23.2349 12.5466C23.4086 12.837 23.5 13.1661 23.5 13.501C23.5 13.8359 23.4086 14.1649 23.2349 14.4554C23.0612 14.7458 22.8113 14.9875 22.51 15.1564L4.504 25.2387C4.20046 25.4087 3.85556 25.4988 3.50412 25.5C3.15268 25.5011 2.80715 25.4133 2.50242 25.2452C2.19768 25.0772 1.94453 24.835 1.76853 24.543C1.59252 24.251 1.4999 23.9196 1.5 23.5823Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
