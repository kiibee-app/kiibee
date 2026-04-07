type SuccessCheckIconProps = {
  size?: number;
  bgColor?: string;
  sideColor?: string;
  checkColor?: string;
  sideWidth?: number;
};

export default function SuccessCheckIcon({
  size = 24,
  bgColor = "transparent",
  sideColor = "transparent",
  checkColor = "currentColor",
  sideWidth = 0,
}: SuccessCheckIconProps) {
  const center = 10;
  const radius = 6;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={bgColor}
        stroke={sideColor}
        strokeWidth={sideWidth}
      />
      <path
        d="M4 12.5L9.5 18.5L20 6"
        stroke={checkColor}
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
