import { ImageType } from "@/utils/ui";

export type UploadConfig = {
  labelKey?: string;
  sizeKey?: string;
  label?: string;
  sizeText?: string;
  cropWidth: number;
  cropHeight: number;
  type: ImageType;
  previewAspectRatio?: string;
  previewMaxWidth?: string;
  previewHeight?: string;
  previewMinHeight?: string;
};

export type CoverImageSectionProps = {
  title?: string;
  subtitle?: boolean;
  uploadConfigs?: UploadConfig[];
  useFormContext?: boolean;
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
