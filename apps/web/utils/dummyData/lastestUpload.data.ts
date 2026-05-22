import latestUploadImage from "@/assets/images/creators/recent_creator.webp";
import latestUploadImageLayout2 from "@/assets/images/creators/recent_creator1.webp";
import type { LatestUploadData } from "@/components/Feature/ProfileLayout/shared/LatestUpload";

export const latestUploadDataLayout1: LatestUploadData = {
  sectionTitle: "Latest upload",
  badge: "Design",
  image: latestUploadImage,
  imageAlt: "Latest upload crochet artwork",
  title: "DET' HELT VILDT - Fasan",
  year: "2019",
  description:
    "PERFEKT TILBEREDT FASAN - sådan gør du, når fasanen skal være saftig og mør. Bogen indeholder kun opskrier på fasan og viser i flotte billeder og gode beskrivelser, hvordan du får det optimale resultat...",
  actions: [
    { title: "Buy 99 kr", subtitle: "Download file" },
    { title: "Rent 50 kr", subtitle: "Access for 3 months" },
  ],
  imageStyle: {
    width: "376px",
    height: "530px",
    padding: "14px 295px 15px 14px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "445px",
  },
  containerStyle: {
    maxWidth: "100%",
    padding: "0",
  },
};

export const latestUploadDataLayout2: LatestUploadData = {
  sectionTitle: "Latest upload",
  badge: "Design",
  image: latestUploadImageLayout2,
  imageAlt: "Latest upload artwork",
  title: "Crochet coasters",
  year: "2019",
  description:
    "PERFEKT TILBEREDT FASAN - sådan gør du, når fasanen skal være saftig og mør. Bogen indeholder kun opskrier på fasan og viser i flotte billeder og gode beskrivelser, hvordan du får det optimale resultat...",
  actions: [{ title: "Rent 50 kr", subtitle: "Access for 3 months" }],
};

export const latestUploadDataLayout3: LatestUploadData = {
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
