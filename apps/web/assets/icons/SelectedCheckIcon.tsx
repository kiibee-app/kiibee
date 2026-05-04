import COLORS from "@repo/ui/colors";

type SelectedCheckIconProps = {
  size?: number;
  color?: string;
  selected?: boolean;
  className?: string;
};

export default function SelectedCheckIcon({
  size = 16,
  color = COLORS.primary.BLACK,
  selected = true,
  className,
}: SelectedCheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0.5"
        y="0.5"
        width="15"
        height="15"
        rx="5"
        fill={selected ? COLORS.primary.PALE_GREEN : COLORS.primary.WHITE}
        stroke={selected ? COLORS.secondary.MEDIUM_GREEN : COLORS.primary.BLACK}
      />
      {selected ? (
        <path
          d="M10.5 3.49992L4.5 9.49992L1.75 6.74992L2.455 6.04492L4.5 8.08492L9.795 2.79492L10.5 3.49992Z"
          fill={color}
          transform="translate(2 2)"
        />
      ) : null}
    </svg>
  );
}
