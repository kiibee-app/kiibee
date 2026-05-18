"use client";

import { useState } from "react";
import COLORS from "@repo/ui/colors";
import theme from "@repo/ui/theme";

export default function TestBoundaryPage() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Intentional test error from /test-boundary route");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: COLORS.neutral.GRAY_100,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "560px",
          background: COLORS.primary.WHITE,
          border: `1px solid ${COLORS.neutral.GRAY_200}`,
          borderRadius: "14px",
          padding: "24px",
          boxShadow: theme.shadows.lg,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.4rem",
            color: COLORS.secondary.main,
          }}
        >
          Error Boundary Test Route
        </h1>
        <p
          style={{
            marginTop: "12px",
            color: COLORS.neutral.GRAY_700,
            lineHeight: 1.5,
          }}
        >
          Click the button below to throw an intentional error and verify the
          global Next.js error boundary UI.
        </p>
        <button
          type="button"
          onClick={() => setShouldCrash(true)}
          style={{
            marginTop: "16px",
            border: "none",
            borderRadius: "10px",
            background: COLORS.primary.RED,
            color: COLORS.primary.WHITE,
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Trigger Test Error
        </button>
      </section>
    </main>
  );
}
