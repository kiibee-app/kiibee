import type { StaticImageData } from "next/image";

export type Variant = "primary" | "secondary";

export function resolveImageUrl(image: string | StaticImageData) {
  return typeof image === "string" ? image : image.src;
}
