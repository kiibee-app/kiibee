type BookIconProps = {
  bg: string;
  fg: string;
};

export default function BookIcon({ bg, fg }: BookIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="12" height="12" rx="2" fill={bg} />
      <rect x="5" y="5" width="6" height="1.5" fill={fg} />
      <rect x="5" y="8" width="6" height="1.5" fill={fg} />
      <rect x="5" y="11" width="4" height="1.5" fill={fg} />
    </svg>
  );
}
