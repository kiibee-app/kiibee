import creatorMainImage from "@/assets/images/creators/creator-woman-orange.webp";
import creatorSideImageOne from "@/assets/images/creators/creator-man-podcast.webp";
import creatorSideImageTwo from "@/assets/images/creators/creator-woman-gray-jacket.webp";
import type { ImageSource } from "@/utils/Constants";

export interface CreatorCard {
  image: ImageSource;
  alt: string;
  title: string;
  subtitle: string;
  narrowBgPosition: string;
  narrowBgSize: string;
}

export interface CreatorCardData {
  cards: CreatorCard[];
}

export const getCreatorCards = (t: (key: string) => string): CreatorCard[] => [
  {
    image: creatorMainImage,
    alt: t("creators.mainCard.alt"),
    title: t("creators.mainCard.title"),
    subtitle: t("creators.mainCard.subtitle"),
    narrowBgPosition: "-360px -1.138px",
    narrowBgSize: "320% 100.235%",
  },
  {
    image: creatorSideImageOne,
    alt: t("creators.salesInsights.alt"),
    title: t("creators.salesInsights.title"),
    subtitle: "",
    narrowBgPosition: "-622.927px -28.838px",
    narrowBgSize: "661.917% 106.472%",
  },
  {
    image: creatorSideImageTwo,
    alt: t("creators.paymentSolutions.alt"),
    title: t("creators.paymentSolutions.title"),
    subtitle: "",
    narrowBgPosition: "-192.28px -0.516px",
    narrowBgSize: "321.398% 125.046%",
  },
];
