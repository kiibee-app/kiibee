import { useTranslation } from "react-i18next";
import { slideImages } from "@/utils/data";

type SlideText = { title: string; description: string };
const STACK_HEIGHTS = ["320px", "300px", "280px"] as const;

export type StackImage = (typeof slideImages)[number] & {
  translateX: string;
  translateY: string;
  scale: number;
  z: number;
};

export function useSlideData(activeIndex = 0) {
  const { t } = useTranslation();

  const slidesText = (
    (t("authSlide.carousel", { returnObjects: true }) ?? []) as SlideText[]
  ).filter(Boolean);

  const safeImageIndex =
    slideImages.length > 0 ? activeIndex % slideImages.length : activeIndex;
  const safeTextIndex =
    slidesText.length > 0 ? activeIndex % slidesText.length : activeIndex;
  const activeSlide = slidesText[safeTextIndex] ?? {
    title: "",
    description: "",
  };
  const fallbackSlideLabel = t("authSlide.slideFallback", "slide");

  const orderedImages = slideImages.map(
    (_, index) => slideImages[(safeImageIndex + index) % slideImages.length],
  );

  const stack: StackImage[] = orderedImages.map((image, index) => ({
    ...image,
    height: STACK_HEIGHTS[index] ?? image.height,
    translateX: `${-index * 34}px`,
    translateY: `${index * 8}px`,
    scale: 1 - index * 0.04,
    z: slideImages.length - index,
  }));

  return {
    slidesText,
    activeSlide,
    fallbackSlideLabel,
    stack,
    t,
    slideCount: slideImages.length,
  };
}
