export default function ExploreIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m10.7 5.3-1.8 3.6-3.6 1.8 1.8-3.6 3.6-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
