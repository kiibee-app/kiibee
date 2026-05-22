import { ImageType } from "@/utils/ui";

export type UploadConfig = {
  labelKey?: string;
  sizeKey?: string;
  label?: string;
  sizeText?: string;
  cropWidth: number;
  cropHeight: number;
  type: ImageType;
};

export type CoverImageSectionProps = {
  title?: string;
  subtitle?: boolean;
  uploadConfigs?: UploadConfig[];
};

export type PreviewStyleConfig = {
  maxWidth: string;
  aspectRatio?: string;
  height?: string;
  minHeight?: string;
  tablet?: {
    maxWidth?: string;
    height?: string;
    minHeight?: string;
  };
};
