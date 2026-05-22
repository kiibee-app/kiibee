import { type ImageSource } from "@/utils/Constants";

export type CtaImageCard = {
  src: ImageSource;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
};
