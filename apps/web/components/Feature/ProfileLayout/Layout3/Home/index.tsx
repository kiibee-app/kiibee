"use client";

import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import Hero from "../Hero";
import LastestUpload from "../../Layout2/Home/LastestUpload";
import type { LastestUploadData } from "../../Layout2/Home/LastestUpload";
import latestUploadImage from "@/assets/images/creators/recent_creator.webp";

export default function Home() {
  const latestUploadData: LastestUploadData = {
    sectionTitle: "Latest upload",
    badge: "Design",
    image: latestUploadImage,
    imageAlt: "Latest upload crochet artwork",
    title: "Crochet coasters",
    year: "2019",
    description:
      "PERFEKT TILBEREDT FASAN - sådan gør du, når fasanen skal være saftig og mør. Bogen indeholder kun opskrier på fasan og viser i flotte billeder og gode beskrivelser, hvordan du får det optimale resultat...",
    actions: [
      { title: "Buy 99 kr", subtitle: "Download file" },
      { title: "Buy collection 200 kr" },
    ],
  };

  return (
    <CreateProfile1Layout>
      <Hero />
      <LastestUpload data={latestUploadData} />
    </CreateProfile1Layout>
  );
}
