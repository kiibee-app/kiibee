"use client";

import LatestUpload from "./LatestUpload";
import type { LatestUploadData } from "./LatestUpload";
import latestUploadImage from "@/assets/images/creators/recent_creator1.webp";
import Hero from "../Hero";
import AboutSection from "../About/AboutSection";
import CreateProfileLayout from "@/components/Layout/CreateProfile2";

export default function Home() {
  const latestUploadData: LatestUploadData = {
    sectionTitle: "Latest upload",
    badge: "Design",
    image: latestUploadImage,
    imageAlt: "Latest upload artwork",
    title: "Crochet coasters",
    year: "2019",
    description:
      "PERFEKT TILBEREDT FASAN - sådan gør du, når fasanen skal være saftig og mør. Bogen indeholder kun opskrier på fasan og viser i flotte billeder og gode beskrivelser, hvordan du får det optimale resultat...",
    actions: [{ title: "Rent 50 kr", subtitle: "Access for 3 months" }],
  };

  return (
    <CreateProfileLayout>
      <Hero />
      <LatestUpload data={latestUploadData} />
      <AboutSection />
    </CreateProfileLayout>
  );
}
