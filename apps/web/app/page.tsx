import type { Metadata } from "next";

import landingOgImage from "@/assets/images/hero-background.webp";
import HomePageClient from "@/components/Feature/landing/HomePage";

const title = "Discover unique digital content from creators";
const description =
  "Discover and enjoy unique digital content from your favorite creators. Watch, listen, and learn directly from independent creators. Rent or buy exclusive content in just a few clicks.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
    images: [
      {
        url: landingOgImage.src,
        width: landingOgImage.width,
        height: landingOgImage.height,
        alt: "Kiibee landing page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [landingOgImage.src],
  },
};

export default function Home() {
  return <HomePageClient />;
}
