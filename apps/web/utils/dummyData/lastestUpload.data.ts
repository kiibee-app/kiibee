import latestUploadImage from "@/assets/images/creators/recent_creator.webp";
import type { LastestUploadData } from "@/components/Feature/ProfileLayout/Layout2/Home/LastestUpload";

export const latestUploadData: LastestUploadData = {
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
