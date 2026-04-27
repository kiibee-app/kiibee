import { useCallback, useState } from "react";
import type { StaticImageData } from "next/image";

type SafeImageSrc = string | StaticImageData;

interface UseSafeImageOptions {
  src: SafeImageSrc;
  fallback: SafeImageSrc;
}

export function useSafeImage({ src, fallback }: UseSafeImageOptions) {
  const [imgSrc, setImgSrc] = useState<SafeImageSrc>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback(() => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
      return;
    }

    setIsError(true);
    setIsLoading(false);
  }, [fallback, imgSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    imgSrc,
    isLoading,
    isError,
    handleError,
    handleLoad,
  };
}
