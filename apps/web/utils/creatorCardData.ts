import heroPayments from "@/assets/images/creators/hero-payments.webp";
import heroStreaming from "@/assets/images/creators/hero-streaming.webp";
import heroDistribution from "@/assets/images/creators/hero-distribution.webp";
import heroMarketing from "@/assets/images/creators/hero-marketing.webp";
import heroCustomerAccess from "@/assets/images/creators/hero-customer-access.webp";
import { ImageSource } from "./Constants";

export interface CreatorCard {
  image: ImageSource;
  alt: string;
  title: string;
  subtitle?: string;
}

export const DEFAULT_ACTIVE_CREATOR_CARD_INDEX = 2;

export const getCreatorCards = (t: (key: string) => string): CreatorCard[] => [
  {
    image: heroPayments,
    alt: t("creators.heroCards.payments.alt"),
    title: t("creators.heroCards.payments.title"),
    subtitle: t("creators.heroCards.payments.subtitle"),
  },
  {
    image: heroStreaming,
    alt: t("creators.heroCards.streaming.alt"),
    title: t("creators.heroCards.streaming.title"),
    subtitle: t("creators.heroCards.streaming.subtitle"),
  },
  {
    image: heroDistribution,
    alt: t("creators.heroCards.distribution.alt"),
    title: t("creators.heroCards.distribution.title"),
    subtitle: t("creators.heroCards.distribution.subtitle"),
  },
  {
    image: heroMarketing,
    alt: t("creators.heroCards.marketing.alt"),
    title: t("creators.heroCards.marketing.title"),
    subtitle: t("creators.heroCards.marketing.subtitle"),
  },
  {
    image: heroCustomerAccess,
    alt: t("creators.heroCards.customerAccess.alt"),
    title: t("creators.heroCards.customerAccess.title"),
    subtitle: t("creators.heroCards.customerAccess.subtitle"),
  },
];
