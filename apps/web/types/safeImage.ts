import { type ImageProps, type StaticImageData } from "next/image";

export type SafeImageSrc = string | StaticImageData;

export type SafeImageProps = Omit<ImageProps, "src"> & {
  src: SafeImageSrc;
  fallback?: SafeImageSrc;
};
