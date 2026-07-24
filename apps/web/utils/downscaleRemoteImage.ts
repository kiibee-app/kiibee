/** Max long-edge pixels for feed/card posters (2x a ~360px card). */
export const CARD_DISPLAY_MAX_EDGE = 720;

const JPEG_QUALITY = 0.82;

type BitmapLike = ImageBitmap | HTMLImageElement;

function getBitmapSize(source: BitmapLike): { width: number; height: number } {
  if ("naturalWidth" in source && source.naturalWidth > 0) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

export async function downscaleRemoteImage(
  url: string,
  maxEdge: number = CARD_DISPLAY_MAX_EDGE,
): Promise<string> {
  if (typeof window === "undefined" || !url) {
    return url;
  }

  try {
    const bitmap = await loadBitmap(url);
    if (!bitmap) {
      return url;
    }

    const { width, height } = getBitmapSize(bitmap);
    if (!width || !height) {
      closeBitmap(bitmap);
      return url;
    }

    if (width <= maxEdge && height <= maxEdge) {
      closeBitmap(bitmap);
      return url;
    }

    const scale = Math.min(maxEdge / width, maxEdge / height, 1);
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      closeBitmap(bitmap);
      return url;
    }

    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    closeBitmap(bitmap);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });

    if (!blob) {
      return url;
    }

    return URL.createObjectURL(blob);
  } catch {
    return url;
  }
}

function closeBitmap(source: BitmapLike) {
  if ("close" in source && typeof source.close === "function") {
    source.close();
  }
}

async function loadBitmap(url: string): Promise<BitmapLike | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const response = await fetch(url, { mode: "cors", credentials: "omit" });
      if (!response.ok) {
        throw new Error(`fetch ${response.status}`);
      }
      const blob = await response.blob();
      return await createImageBitmap(blob);
    } catch {}
  }

  return loadHtmlImage(url);
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = url;
  });
}
