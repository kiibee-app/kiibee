"use client";

import { useRef, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "./CreatorAppearanceSettings.styles";
import { Modal } from "../../common/Modal";

/** Drag to position and zoom within the circular profile preview. */
export default function LogoCropModal({
  src,
  onClose,
  onApply,
}: {
  src: string;
  onClose: () => void;
  onApply: (value: string) => void;
}) {
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 240, height: 240 });
  const clamp = (value: number, dimension: number, nextZoom = zoom) => {
    const scale =
      Math.max(240 / dimensions.width, 240 / dimensions.height) * nextZoom;
    const limit = (Math.max(0, (dimension * scale - 240) / 2) / 240) * 100;
    return Math.max(-limit, Math.min(limit, value));
  };
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const apply = async () => {
    setBusy(true);
    setError("");
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      const scale =
        Math.max(512 / img.naturalWidth, 512 / img.naturalHeight) * zoom;
      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;
      ctx.drawImage(
        img,
        (512 - width) / 2 + (x * 512) / 100,
        (512 - height) / 2 + (y * 512) / 100,
        width,
        height,
      );
      onApply(canvas.toDataURL("image/png"));
    } catch {
      setError(
        "Could not prepare this logo. Please upload the original image again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open title="Adjust channel logo" size="sm" onClose={onClose}>
      <p>Drag to reposition your logo. Use the slider to zoom.</p>
      <div
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            startX: x,
            startY: y,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          setX(
            clamp(
              drag.current.startX +
                ((event.clientX - drag.current.x) / 240) * 100,
              dimensions.width,
            ),
          );
          setY(
            clamp(
              drag.current.startY +
                ((event.clientY - drag.current.y) / 240) * 100,
              dimensions.height,
            ),
          );
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        style={{
          touchAction: "none",
          cursor: "grab",
          width: 240,
          height: 240,
          margin: "20px auto",
          overflow: "hidden",
          border: "1px solid #dde3df",
          borderRadius: 8,
          background: "#f5f6f5",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Logo crop preview"
          draggable={false}
          onLoad={(event) =>
            setDimensions({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width:
              dimensions.width *
              Math.max(240 / dimensions.width, 240 / dimensions.height),
            height:
              dimensions.height *
              Math.max(240 / dimensions.width, 240 / dimensions.height),
            maxWidth: "none",
            pointerEvents: "none",
            transform: `translate(calc(-50% + ${x * 2.4}px), calc(-50% + ${y * 2.4}px)) scale(${zoom})`,
            transformOrigin: "center",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.9)",
            boxSizing: "border-box",
            boxShadow: "0 0 0 999px rgba(15, 23, 42, 0.5)",
            pointerEvents: "none",
          }}
        />
      </div>
      <label style={{ display: "block", margin: "12px 0" }}>
        Zoom
        <input
          aria-label="Logo zoom"
          style={{ display: "block", width: "100%" }}
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(event) => {
            const next = Number(event.target.value);
            setZoom(next);
            setX(clamp(x, dimensions.width, next));
            setY(clamp(y, dimensions.height, next));
          }}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 20,
        }}
      >
        <SecondaryButton
          type="button"
          disabled={busy}
          onClick={() => {
            setZoom(1);
            setX(0);
            setY(0);
          }}
        >
          Reset
        </SecondaryButton>
        <SecondaryButton type="button" disabled={busy} onClick={onClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          type="button"
          disabled={busy}
          onClick={() => void apply()}
        >
          {busy ? "Preparing…" : "Use logo"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
