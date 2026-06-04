import React from "react";

export const SpinnerIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: "spin-loader 0.8s linear infinite",
    }}
  >
    <style>{`
      @keyframes spin-loader {
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
    <g stroke="#000000" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4" opacity="0.2" />
      <path d="M19.07 4.93l-2.83 2.83" opacity="0.3" />
      <path d="M22 12h-4" opacity="0.4" />
      <path d="M19.07 19.07l-2.83-2.83" opacity="0.5" />
      <path d="M12 22v-4" opacity="0.6" />
      <path d="M4.93 19.07l2.83-2.83" opacity="0.7" />
      <path d="M2 12h4" opacity="0.8" />
      <path d="M4.93 4.93l2.83 2.83" opacity="0.9" />
    </g>
  </svg>
);
