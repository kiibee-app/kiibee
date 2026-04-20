export const sizeMap = {
  sm: { spinner: 24, border: 3 },
  md: { spinner: 40, border: 4 },
  lg: { spinner: 56, border: 5 },
} as const;

export type LoaderSize = keyof typeof sizeMap;

export const GENERIC_LOADER_VARIANT = {
  OVERLAY: "overlay",
  INLINE: "inline",
  FULLPAGE: "fullpage",
} as const;

export type GenericLoaderVariant =
  (typeof GENERIC_LOADER_VARIANT)[keyof typeof GENERIC_LOADER_VARIANT];

export type GenericLoaderProps = {
  isOpen?: boolean;
  variant?: GenericLoaderVariant;
  size?: LoaderSize;
  label?: string;
  isTransparent?: boolean;
  closeOnEsc?: boolean;
  onClose?: () => void;
  className?: string;
};
