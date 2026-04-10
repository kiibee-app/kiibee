import { useTranslation } from "react-i18next";
import { slideImages } from "@/utils/data";

type SlideText = { title: string; description: string };

export type StackImage = (typeof slideImages)[number] & {
  translateX: string;
  translateY: string;
  scale: number;
  z: number;
};

export function useSlideData() {
  const { t } = useTranslation();

  const slidesText = (
    (t("authSlide.carousel", { returnObjects: true }) ?? []) as SlideText[]
  ).filter(Boolean);

  const activeSlide = slidesText[0] ?? { title: "", description: "" };
  const fallbackSlideLabel = t("authSlide.slideFallback", "slide");

  const stack: StackImage[] = slideImages.map((image, index) => ({
    ...image,
    translateX: `${-index * 34}px`,
    translateY: `${index * 8}px`,
    scale: 1 - index * 0.04,
    z: slideImages.length - index,
  }));

  return { slidesText, activeSlide, fallbackSlideLabel, stack, t };
}
