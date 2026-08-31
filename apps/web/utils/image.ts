import { authStorage } from "@/lib/auth/authStorage";
import { API } from "@/lib/http/api/endpoints";
import { API_BASE_URL } from "@/lib/http/config";
import {
  canUseDOM,
  CROP_EXPORT_MAX_EDGE,
  CROP_LETTERBOX_BLUR_PX,
  CROP_LETTERBOX_DIM,
  CROP_LETTERBOX_FILL,
  CROP_LETTERBOX_SCALE,
  isBrowser,
} from "./ui";
import React, { useCallback, useRef, useState } from "react";

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
  displayWidth: number;
  displayHeight: number;
};

const getSourceCropDraw = (
  srcX: number,
  srcY: number,
  srcW: number,
  srcH: number,
  imageWidth: number,
  imageHeight: number,
  outW: number,
  outH: number,
) => {
  let sx = srcX;
  let sy = srcY;
  let sw = srcW;
  let sh = srcH;
  let dx = 0;
  let dy = 0;
  let dw = outW;
  let dh = outH;

  if (sx < 0) {
    const cut = (-sx / srcW) * outW;
    dx += cut;
    dw -= cut;
    sw += sx;
    sx = 0;
  }
  if (sy < 0) {
    const cut = (-sy / srcH) * outH;
    dy += cut;
    dh -= cut;
    sh += sy;
    sy = 0;
  }
  if (sx + sw > imageWidth) {
    const overflow = sx + sw - imageWidth;
    dw -= (overflow / srcW) * outW;
    sw = imageWidth - sx;
  }
  if (sy + sh > imageHeight) {
    const overflow = sy + sh - imageHeight;
    dh -= (overflow / srcH) * outH;
    sh = imageHeight - sy;
  }

  return { sx, sy, sw, sh, dx, dy, dw, dh };
};

const drawCoverImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  outW: number,
  outH: number,
  scale = 1,
) => {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = outW / outH;
  let drawW = outW;
  let drawH = outH;
  if (imgAspect > canvasAspect) {
    drawH = outH * scale;
    drawW = drawH * imgAspect;
  } else {
    drawW = outW * scale;
    drawH = drawW / imgAspect;
  }
  ctx.drawImage(img, (outW - drawW) / 2, (outH - drawH) / 2, drawW, drawH);
};

const drawBlurredCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  outW: number,
  outH: number,
) => {
  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = outW;
  blurCanvas.height = outH;
  const blurCtx = blurCanvas.getContext("2d");
  if (!blurCtx) {
    ctx.fillStyle = CROP_LETTERBOX_FILL;
    ctx.fillRect(0, 0, outW, outH);
    return;
  }

  blurCtx.imageSmoothingEnabled = true;
  blurCtx.imageSmoothingQuality = "high";
  blurCtx.filter = `blur(${CROP_LETTERBOX_BLUR_PX}px)`;
  drawCoverImage(blurCtx, img, outW, outH, CROP_LETTERBOX_SCALE);
  ctx.filter = "none";
  ctx.drawImage(blurCanvas, 0, 0);
  ctx.fillStyle = CROP_LETTERBOX_DIM;
  ctx.fillRect(0, 0, outW, outH);
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
        position,
        displayWidth,
        displayHeight,
      } = display;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const frameW = Math.max(1, containerWidth);
      const frameH = Math.max(1, containerHeight);
      const shownW = Math.max(1, displayWidth);
      const shownH = Math.max(1, displayHeight);

      const imgLeft = frameW / 2 + position.x - shownW / 2;
      const imgTop = frameH / 2 + position.y - shownH / 2;
      const srcX = ((0 - imgLeft) / shownW) * iw;
      const srcY = ((0 - imgTop) / shownH) * ih;
      const srcW = (frameW / shownW) * iw;
      const srcH = (frameH / shownH) * ih;

      let outW = srcW;
      let outH = srcH;
      const longEdge = Math.max(outW, outH);
      if (longEdge > CROP_EXPORT_MAX_EDGE) {
        const scale = CROP_EXPORT_MAX_EDGE / longEdge;
        outW *= scale;
        outH *= scale;
      }

      canvas.width = Math.max(1, Math.round(outW));
      canvas.height = Math.max(1, Math.round(outH));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.filter = "none";
      drawBlurredCover(ctx, img, canvas.width, canvas.height);

      const draw = getSourceCropDraw(
        srcX,
        srcY,
        srcW,
        srcH,
        iw,
        ih,
        canvas.width,
        canvas.height,
      );

      if (draw.sw > 0 && draw.sh > 0 && draw.dw > 0 && draw.dh > 0) {
        ctx.drawImage(
          img,
          draw.sx,
          draw.sy,
          draw.sw,
          draw.sh,
          draw.dx,
          draw.dy,
          draw.dw,
          draw.dh,
        );
      }

      resolve(canvas.toDataURL("image/jpeg", 1));
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
