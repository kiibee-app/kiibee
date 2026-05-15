import type { Metadata } from "next";

import landingOgImage from "@/assets/images/hero-background.webp";
import HomePageClient from "@/components/Feature/landing/HomePage";
import {
  KIIBEE_LANDING_PAGE_PREVIEW_ALT,
  TWITTER_CARD_SUMMARY_LARGE_IMAGE,
  WEBSITE,
} from "@/utils/Constants";
import { PATHS } from "@/utils/path";

const title = "Discover unique digital content from creators";
const description =
  "Discover and enjoy unique digital content from your favorite creators. Watch, listen, and learn directly from independent creators. Rent or buy exclusive content in just a few clicks.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: PATHS.HOME,
  },
  openGraph: {
    title,
    description,
    url: PATHS.HOME,
    type: WEBSITE,
    images: [
      {
        url: landingOgImage.src,
        width: landingOgImage.width,
        height: landingOgImage.height,
        alt: KIIBEE_LANDING_PAGE_PREVIEW_ALT,
      },
    ],
  },
  twitter: {
    card: TWITTER_CARD_SUMMARY_LARGE_IMAGE,
    title,
    description,
    images: [landingOgImage.src],
  },
};

export default function Home() {
  return <HomePageClient />;
}
