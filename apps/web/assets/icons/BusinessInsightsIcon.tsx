import COLORS from "@repo/ui/colors";
import type { IconProps } from "./types";

export default function BusinessInsightsIcon({
  width = 40,
  height = 40,
  color = COLORS.primary.GREEN_100,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M4 4V34.375C4 34.6734 4.11853 34.9595 4.3295 35.1705C4.54048 35.3815 4.82663 35.5 5.125 35.5H35.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7188 17.499H9.90625C9.1296 17.499 8.5 18.1286 8.5 18.9053V29.5928C8.5 30.3694 9.1296 30.999 9.90625 30.999H12.7188C13.4954 30.999 14.125 30.3694 14.125 29.5928V18.9053C14.125 18.1286 13.4954 17.499 12.7188 17.499Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.8438 14.126H20.0312C19.2546 14.126 18.625 14.7556 18.625 15.5322V29.5947C18.625 30.3714 19.2546 31.001 20.0312 31.001H22.8438C23.6204 31.001 24.25 30.3714 24.25 29.5947V15.5322C24.25 14.7556 23.6204 14.126 22.8438 14.126Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.9434 9.62402H30.1309C29.3542 9.62402 28.7246 10.2536 28.7246 11.0303V29.5928C28.7246 30.3694 29.3542 30.999 30.1309 30.999H32.9434C33.72 30.999 34.3496 30.3694 34.3496 29.5928V11.0303C34.3496 10.2536 33.72 9.62402 32.9434 9.62402Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
