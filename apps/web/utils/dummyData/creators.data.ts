import simon from "@/assets/images/call_to_action/creator-1.jpg";
import chief from "@/assets/images/call_to_action/creator-2.png";
import morten from "@/assets/images/call_to_action/creator-3.png";
import kammas from "@/assets/images/call_to_action/creator-4.png";
import { StaticImageData } from "next/image";

export type CreatorCategory = "Comedy" | "Music" | "Publication" | "Cooking";

export type CreatorProfile = {
  id: string;
  name: string;
  category: CreatorCategory;
  uploads: number;
  image: string | StaticImageData;
};

export const creators: CreatorProfile[] = [
  {
    id: "1",
    name: "Simon Talbot",
    category: "Comedy",
    uploads: 10,
    image: simon,
  },
  {
    id: "2",
    name: "Chief1",
    category: "Music",
    uploads: 20,
    image: chief,
  },
  {
    id: "3",
    name: "Morten Bonde",
    category: "Publication",
    uploads: 15,
    image: morten,
  },
  {
    id: "4",
    name: "Kammas kantine",
    category: "Cooking",
    uploads: 40,
    image: kammas,
  },
  {
    id: "5",
    name: "Simon Talbot",
    category: "Comedy",
    uploads: 23,
    image: simon,
  },
  {
    id: "6",
    name: "Chief1",
    category: "Music",
    uploads: 56,
    image: chief,
  },
  {
    id: "7",
    name: "Morten Bonde",
    category: "Publication",
    uploads: 41,
    image: morten,
  },
  {
    id: "8",
    name: "Kammas kantine",
    category: "Cooking",
    uploads: 13,
    image: kammas,
  },
  {
    id: "9",
    name: "Simon Talbot",
    category: "Comedy",
    uploads: 12,
    image: simon,
  },
  {
    id: "10",
    name: "Chief1",
    category: "Music",
    uploads: 78,
    image: chief,
  },
  {
    id: "11",
    name: "Morten Bonde",
    category: "Publication",
    uploads: 21,
    image: morten,
  },
  {
    id: "12",
    name: "Kammas kantine",
    category: "Cooking",
    uploads: 40,
    image: kammas,
  },
  {
    id: "13",
    name: "Simon Talbot",
    category: "Comedy",
    uploads: 67,
    image: simon,
  },
  {
    id: "14",
    name: "Chief1",
    category: "Music",
    uploads: 43,
    image: chief,
  },
  {
    id: "15",
    name: "Morten Bonde",
    category: "Publication",
    uploads: 27,
    image: morten,
  },
  {
    id: "16",
    name: "Kammas kantine",
    category: "Cooking",
    uploads: 89,
    image: kammas,
  },
  {
    id: "17",
    name: "Simon Talbot",
    category: "Comedy",
    uploads: 75,
    image: simon,
  },
  {
    id: "18",
    name: "Chief1",
    category: "Music",
    uploads: 83,
    image: chief,
  },
  {
    id: "19",
    name: "Morten Bonde",
    category: "Publication",
    uploads: 37,
    image: morten,
  },
  {
    id: "20",
    name: "Kammas kantine",
    category: "Cooking",
    uploads: 93,
    image: kammas,
  },

  {
    id: "21",
    name: "Simon Talbot",
    category: "Comedy",
    uploads: 37,
    image: simon,
  },
  {
    id: "22",
    name: "Chief1",
    category: "Music",
    uploads: 28,
    image: chief,
  },
  {
    id: "23",
    name: "Morten Bonde",
    category: "Publication",
    uploads: 83,
    image: morten,
  },
  {
    id: "24",
    name: "Kammas kantine",
    category: "Cooking",
    uploads: 27,
    image: kammas,
  },
];
