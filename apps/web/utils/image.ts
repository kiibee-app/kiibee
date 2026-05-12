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

export const getCroppedImg = (
  imageSrc: string,
  containerWidth: number,
  containerHeight: number,
  cropArea: { x: number; y: number; width: number; height: number },
  position: { x: number; y: number },
  zoom: number,
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

      const safeZoom = zoom > 0 ? zoom : 1;
      const scaleFactor = window.devicePixelRatio || 1;
      const cropWidth = Math.max(1, Math.round(cropArea.width));
      const cropHeight = Math.max(1, Math.round(cropArea.height));

      canvas.width = cropWidth * scaleFactor;
      canvas.height = cropHeight * scaleFactor;
      ctx.scale(scaleFactor, scaleFactor);

      const containScale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height,
      );
      const baseWidth = img.width * containScale;
      const baseHeight = img.height * containScale;

      const transformedWidth = baseWidth * safeZoom;
      const transformedHeight = baseHeight * safeZoom;
      const transformedX =
        containerWidth / 2 +
        ((containerWidth - baseWidth) / 2) * safeZoom -
        (containerWidth / 2) * safeZoom +
        position.x;
      const transformedY =
        containerHeight / 2 +
        ((containerHeight - baseHeight) / 2) * safeZoom -
        (containerHeight / 2) * safeZoom +
        position.y;

      const sourceX = Math.max(
        0,
        ((cropArea.x - transformedX) / transformedWidth) * img.width,
      );
      const sourceY = Math.max(
        0,
        ((cropArea.y - transformedY) / transformedHeight) * img.height,
      );
      const sourceWidth = Math.max(
        1,
        Math.min(
          img.width - sourceX,
          (cropArea.width / transformedWidth) * img.width,
        ),
      );
      const sourceHeight = Math.max(
        1,
        Math.min(
          img.height - sourceY,
          (cropArea.height / transformedHeight) * img.height,
        ),
      );

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );
      resolve(canvas.toDataURL("image/webp", 1.0));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};
