import React from "react";

interface WarningIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function WarningIcon({
  width = 18,
  height = 18,
  color = "#f97316",
  className,
}: WarningIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55198 18.9945C1.55101 19.3437 1.64151 19.6868 1.81442 19.9893C1.98733 20.2918 2.23675 20.5427 2.53773 20.7168C2.83871 20.891 3.18082 20.9823 3.53 20.98H20.47C20.8192 20.9823 21.1613 20.891 21.4623 20.7168C21.7633 20.5427 22.0127 20.2918 22.1856 19.9893C22.3585 19.6868 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56613 13.2807 3.32314 12.9812 3.15448C12.6817 2.98583 12.3437 2.89746 12 2.89746C11.6563 2.89746 11.3183 2.98583 11.0188 3.15448C10.7193 3.32314 10.4683 3.56613 10.29 3.86Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
