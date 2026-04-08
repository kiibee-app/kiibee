import creatorMainImage from "../assets/images/creators/creator-woman-orange.jpg";
import creatorSideImageOne from "../assets/images/creators/creator-man-podcast.jpg";
import creatorSideImageTwo from "../assets/images/creators/creator-woman-gray-jacket.jpg";

export interface CreatorCard {
  image: string;
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
    image: creatorMainImage.src,
    alt: t("creators.mainCard.alt"),
    title: t("creators.mainCard.title"),
    subtitle: t("creators.mainCard.subtitle"),
    narrowBgPosition: "-360px -1.138px",
    narrowBgSize: "320% 100.235%",
  },
  {
    image: creatorSideImageOne.src,
    alt: t("creators.salesInsights.alt"),
    title: t("creators.salesInsights.title"),
    subtitle: "",
    narrowBgPosition: "-622.927px -28.838px",
    narrowBgSize: "661.917% 106.472%",
  },
  {
    image: creatorSideImageTwo.src,
    alt: t("creators.paymentSolutions.alt"),
    title: t("creators.paymentSolutions.title"),
    subtitle: "",
    narrowBgPosition: "-192.28px -0.516px",
    narrowBgSize: "321.398% 125.046%",
  },
];
