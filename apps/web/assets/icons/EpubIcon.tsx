import { COLORS } from "@repo/ui/colors";
import { SVG_XMLNS } from "@/utils/Constants";
import type { IconProps } from "./types";

export default function EpubIcon({
  width = 16,
  height = 18,
  color = COLORS.primary.BLACK,
  className,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 18"
      fill="none"
      xmlns={SVG_XMLNS}
      className={className}
      aria-hidden={title ? undefined : true}
      aria-label={title || "E-pub"}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M1.5 0C0.67 0 0 .67 0 1.5V15c0 .83.67 1.5 1.5 1.5H10c.83 0 1.5-.67 1.5-1.5V4.5L10 0H1.5Z"
        fill={color}
      />
      <text
        x="2.2"
        y="11"
        fill="#fff"
        fontSize="4"
        fontWeight="700"
        letterSpacing="0.05em"
        fontFamily="Arial, Helvetica, sans-serif"
        dominantBaseline="middle"
      >
        EPUB
      </text>
    </svg>
  );
}
