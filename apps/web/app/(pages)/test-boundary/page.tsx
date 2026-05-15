"use client";

import { useState } from "react";

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
        background: "#f1f5f9",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(2, 6, 23, 0.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#0f172a" }}>
          Error Boundary Test Route
        </h1>
        <p style={{ marginTop: "12px", color: "#334155", lineHeight: 1.5 }}>
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
            background: "#b91c1c",
            color: "#ffffff",
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
