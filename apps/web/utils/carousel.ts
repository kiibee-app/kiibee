import { LeftArrow, RightArrow } from "@/assets/icons";
import { Directions } from "@/utils/ui";

export const getNavigationArrows = (
  prevSlide: () => void,
  nextSlide: () => void,
  prevAriaLabel?: string,
  nextAriaLabel?: string,
) =>
  [
    {
      direction: Directions.LEFT,
      onClick: prevSlide,
      label: prevAriaLabel,
      Icon: LeftArrow,
    },
    {
      direction: Directions.RIGHT,
      onClick: nextSlide,
      label: nextAriaLabel,
      Icon: RightArrow,
    },
  ] as const;
