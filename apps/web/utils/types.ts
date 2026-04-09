import type { StaticImageData } from "next/image";
import type { LoaderSize } from "@/components/UI/GenericLoader/styles";

export type GenericLoaderVariant = "overlay" | "inline" | "fullpage";

export interface GenericLoaderProps {
  isOpen?: boolean;
  variant?: GenericLoaderVariant;
  size?: LoaderSize;
  label?: string;
  isTransparent?: boolean;
  closeOnEsc?: boolean;
  onClose?: () => void;
  className?: string;
}

export type TutorialVideo = {
  id: string;
  title: string;
  category: string;
  creator: string;
  published: string;
  focus: string;
  level: string;
  formatLabel: string;
  image: string | StaticImageData;
};
