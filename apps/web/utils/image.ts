import { authStorage } from "@/lib/auth/authStorage";
import { API } from "@/lib/http/api/endpoints";
import { API_BASE_URL } from "@/lib/http/config";
import { canUseDOM, isBrowser } from "./ui";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        return;
      }

      resolve(reader.result ?? "");
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export type CropDisplayState = {
  containerWidth: number;
  containerHeight: number;
  cropWidth: number;
  cropHeight: number;
  position: { x: number; y: number };
  zoom: number;
};

export const getCroppedImg = (
  imageSrc: string,
  display: CropDisplayState,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isBrowser || !canUseDOM) {
      reject(new Error("Image cropping requires a browser environment"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not found"));
        return;
      }

      const {
        containerWidth,
        containerHeight,
        cropWidth,
        cropHeight,
        position,
        zoom,
      } = display;
      const safeZoom = zoom > 0 ? zoom : 1;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const cropAspect = cropWidth / cropHeight;
      let displayCropW = cropWidth;
      let displayCropH = cropHeight;
      if (displayCropW > containerWidth) {
        displayCropW = containerWidth;
        displayCropH = containerWidth / cropAspect;
      }
      if (displayCropH > containerHeight) {
        displayCropH = containerHeight;
        displayCropW = containerHeight * cropAspect;
      }

      const cropLeft = (containerWidth - displayCropW) / 2 + 20;
      const cropTop = (containerHeight - displayCropH) / 2 + 20;
      const actualCropW = Math.max(1, displayCropW - 40);
      const actualCropH = Math.max(1, displayCropH - 40);

      const rawCoverScale = Math.max(actualCropW / iw, actualCropH / ih);
      const coverScale = Math.min(1, rawCoverScale);
      const baseW = iw * coverScale;
      const baseH = ih * coverScale;
      const displayW = baseW * safeZoom;
      const displayH = baseH * safeZoom;

      const imgLeft = containerWidth / 2 + position.x - displayW / 2;
      const imgTop = containerHeight / 2 + position.y - displayH / 2;

      const outputScale = Math.max(
        3,
        Math.min(4, window.devicePixelRatio || 3),
      );
      const outW = Math.round(cropWidth * outputScale);
      const outH = Math.round(cropHeight * outputScale);

      canvas.width = outW;
      canvas.height = outH;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.save();
      ctx.filter = "blur(20px)";
      const canvasAspect = outW / outH;
      const imgAspect = iw / ih;
      let drawW = outW;
      let drawH = outH;
      if (imgAspect > canvasAspect) {
        drawW = outH * imgAspect;
      } else {
        drawH = outW / imgAspect;
      }
      const scaleFactor = 1.15;
      ctx.translate(outW / 2, outH / 2);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(0, 0, outW, outH);

      const canvasScaleX = outW / actualCropW;
      const canvasScaleY = outH / actualCropH;
      const imgLeftRel = imgLeft - cropLeft;
      const imgTopRel = imgTop - cropTop;

      const destX = imgLeftRel * canvasScaleX;
      const destY = imgTopRel * canvasScaleY;
      const destW = displayW * canvasScaleX;
      const destH = displayH * canvasScaleY;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, outW, outH);
      ctx.clip();
      ctx.drawImage(img, destX, destY, destW, destH);
      ctx.restore();

      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

export async function resolveProfileAvatarUrl(
  avatar: string | null,
): Promise<string | null> {
  if (!avatar) return null;
  if (!avatar.startsWith("data:image/")) return avatar;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const token = authStorage.getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${API.media.imagesUpload}`, {
    method: "POST",
    body: JSON.stringify({ image: avatar }),
    credentials: "include",
    headers,
  });

  const data = (await response.json().catch(() => null)) as {
    url?: string;
    message?: string;
  } | null;

  if (!response.ok || !data?.url) {
    if (response.status === 413) {
      throw new Error("errors.imageTooLarge");
    }
    throw new Error(data?.message ?? "errors.imageUploadFailed");
  }

  return data.url;
}

export type DragPosition = { x: number; y: number };

export interface DragDimensions {
  displayW: number;
  displayH: number;
  frameW: number;
  frameH: number;
}

export function useImageDrag(
  pendingImage: string | null,
  dragClickThresholdPx: number = 8,
  dimensions?: DragDimensions,
) {
  const [position, setPosition] = useState<DragPosition>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const dragMovedRef = useRef(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const clampPosition = useCallback(
    (x: number, y: number) => {
      if (!dimensions) return { x, y };
      const { displayW, displayH, frameW, frameH } = dimensions;
      if (displayW === 0 || displayH === 0 || frameW === 0 || frameH === 0) {
        return { x, y };
      }
      let clampedX = x;
      let clampedY = y;

      if (displayW > frameW) {
        const maxBoundX = (displayW - frameW) / 2;
        clampedX = Math.max(-maxBoundX, Math.min(maxBoundX, x));
      } else {
        clampedX = 0;
      }

      if (displayH > frameH) {
        const maxBoundY = (displayH - frameH) / 2;
        clampedY = Math.max(-maxBoundY, Math.min(maxBoundY, y));
      } else {
        clampedY = 0;
      }

      return { x: clampedX, y: clampedY };
    },
    [dimensions],
  );

  const clamped = clampPosition(position.x, position.y);
  if (clamped.x !== position.x || clamped.y !== position.y) {
    setPosition(clamped);
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!pendingImage) return;

      dragMovedRef.current = false;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: position.x,
        originY: position.y,
      };

      setDragging(true);
    },
    [pendingImage, position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragRef.current) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > dragClickThresholdPx) {
        dragMovedRef.current = true;
      }

      setPosition(
        clampPosition(
          dragRef.current.originX + dx,
          dragRef.current.originY + dy,
        ),
      );
    },
    [dragClickThresholdPx, clampPosition],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!pendingImage || e.touches.length !== 1) return;
      const touch = e.touches[0];

      dragMovedRef.current = false;
      dragRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        originX: position.x,
        originY: position.y,
      };

      setDragging(true);
    },
    [pendingImage, position],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragRef.current || e.touches.length !== 1) return;
      const touch = e.touches[0];

      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > dragClickThresholdPx) {
        dragMovedRef.current = true;
      }

      setPosition(
        clampPosition(
          dragRef.current.originX + dx,
          dragRef.current.originY + dy,
        ),
      );
    },
    [dragClickThresholdPx, clampPosition],
  );

  const stopDragging = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  const resetDragPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setDragging(false);
    dragRef.current = null;
    dragMovedRef.current = false;
  }, []);

  return {
    position,
    dragging,
    dragMoved: dragMovedRef,
    handleMouseDown,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    stopDragging,
    resetDragPosition,
    setPosition,
  };
}
