import design from "../assets/images/design.webp";
import loginSlide from "../assets/images/auth/loginSlide.webp";
import loginSlide1 from "../assets/images/auth/loginSlide1.webp";
import loginSlide2 from "../assets/images/auth/loginSlide2.webp";
import layoutOneImage from "@/assets/images/layout1.png";
import layoutTwoImage from "@/assets/images/layout2.png";
import layoutThreeImage from "@/assets/images/layout3.png";
import creator from "@/assets/images/testimonial/creator.webp";
import valueBg from "@/assets/images/cta-buttom.webp";
import ctaImage from "@/assets/images/cta-buttom1.webp";

import type {
  LayoutCardConfig,
  TestimonialSlideConfig,
  TutorialVideo,
} from "./types";
import { FORMAT_TYPE } from "./types";

/** Minimal card shape for profile/collection previews when merging API content. */
export const tutorialVideoCardFallback: TutorialVideo = {
  id: "placeholder",
  title: "",
  category: "",
  creator: "Kiibee",
  published: "",
  focus: "",
  level: "Free",
  formatLabel: "Video",
  formatType: FORMAT_TYPE.VIDEO,
  image: design,
};

export const layoutCards: LayoutCardConfig[] = [
  {
    key: "layout1",
    titleKey: "contents.appearance.layouts.options.layout1",
    captionKey: "contents.appearance.layouts.preview",
    image: layoutOneImage,
  },
  {
    key: "layout2",
    titleKey: "contents.appearance.layouts.options.layout2",
    captionKey: "contents.appearance.layouts.preview",
    image: layoutTwoImage,
  },
  {
    key: "layout3",
    titleKey: "contents.appearance.layouts.options.layout3",
    captionKey: "contents.appearance.layouts.preview",
    image: layoutThreeImage,
  },
];

export const slideImages = [
  {
    id: "primary",
    src: loginSlide,
    offsetX: "-8px",
    offsetY: "0px",
    z: 3,
    height: "320px",
  },
  {
    id: "secondary",
    src: loginSlide1,
    offsetX: "2px",
    offsetY: "22px",
    z: 2,
    height: "300px",
  },
  {
    id: "tertiary",
    src: loginSlide2,
    offsetX: "4px",
    offsetY: "44px",
    z: 1,
    height: "280px",
  },
];

export const testimonialSlides: TestimonialSlideConfig[] = [
  {
    id: 1,
    image: creator,
    bgPosition: "32% 22%",
    bgPositionMobile: "center 20%",
    quoteKey: "testimonial.quote",
    authorKey: "testimonial.author",
  },
  {
    id: 2,
    image: valueBg,
    bgPosition: "center",
    bgPositionMobile: "center",
    quoteKey: "testimonial.quote2",
    authorKey: "testimonial.author2",
  },
  {
    id: 3,
    image: ctaImage,
    bgPosition: "center",
    bgPositionMobile: "center",
    quoteKey: "testimonial.quote3",
    authorKey: "testimonial.author3",
  },
];
