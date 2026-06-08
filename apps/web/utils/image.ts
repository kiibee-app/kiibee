import { authStorage } from "@/lib/auth/authStorage";
import { API } from "@/lib/http/api/endpoints";
import { API_BASE_URL } from "@/lib/http/config";
import { canUseDOM, isBrowser } from "./ui";

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

      const coverScale = Math.max(containerWidth / iw, containerHeight / ih);
      const baseW = iw * coverScale;
      const baseH = ih * coverScale;
      const displayW = baseW * safeZoom;
      const displayH = baseH * safeZoom;

      const imgLeft = containerWidth / 2 + position.x - displayW / 2;
      const imgTop = containerHeight / 2 + position.y - displayH / 2;
      const cropLeft = (containerWidth - cropWidth) / 2;
      const cropTop = (containerHeight - cropHeight) / 2;

      const scaleX = iw / displayW;
      const scaleY = ih / displayH;

      let sourceX = (cropLeft - imgLeft) * scaleX;
      let sourceY = (cropTop - imgTop) * scaleY;
      let sourceW = cropWidth * scaleX;
      let sourceH = cropHeight * scaleY;

      if (sourceX < 0) {
        sourceW += sourceX;
        sourceX = 0;
      }
      if (sourceY < 0) {
        sourceH += sourceY;
        sourceY = 0;
      }
      sourceW = Math.min(sourceW, iw - sourceX);
      sourceH = Math.min(sourceH, ih - sourceY);
      sourceW = Math.max(1, sourceW);
      sourceH = Math.max(1, sourceH);

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
      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, outW, outH);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

const dataUrlToFile = (dataUrl: string): File => {
  const [header, base64 = ""] = dataUrl.split(",");
  const mime = header?.match(/data:([^;]+)/)?.[1] ?? "image/webp";
  const ext = mime.includes("png")
    ? "png"
    : mime.includes("jpeg")
      ? "jpg"
      : "webp";
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new File([bytes], `avatar.${ext}`, { type: mime });
};

/** Upload cropped data URLs via media API; pass through existing http(s) URLs. */
export async function resolveProfileAvatarUrl(
  avatar: string | null,
): Promise<string | null> {
  if (!avatar) return null;
  if (!avatar.startsWith("data:image/")) return avatar;

  const formData = new FormData();
  formData.append("file", dataUrlToFile(avatar));

  const headers: HeadersInit = { Accept: "application/json" };
  const token = authStorage.getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${API.media.imagesUpload}`, {
    method: "POST",
    body: formData,
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
