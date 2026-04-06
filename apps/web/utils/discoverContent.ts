import imageOne from "@/assets/images/discover-content/3545227dd1e7a9cd6faf3b14586708d85137ed35.png";
import imageTwo from "@/assets/images/discover-content/4ccc137164285071261595311fa290373bc45c72.jpg";
import imageThree from "@/assets/images/discover-content/52c1c126e76296e3c8e39b9ac60f6d9a34156583.png";
import imageFour from "@/assets/images/discover-content/c9051991a79ffc5a50dd15afe7b8c86e09f7faad.jpg";

export type DiscoverContentAction = {
  label: string;
  fullWidth?: boolean;
};

export type DiscoverContentItem = {
  id: number;
  category: string;
  image: typeof imageOne;
  title: string;
  author: string;
  date: string;
  mediaType: "Video" | "E-pub";
  actions: DiscoverContentAction[];
};

export const discoverContentData: DiscoverContentItem[] = [
  {
    id: 1,
    category: "Comedy",
    image: imageTwo,
    title: "Krøllehjern",
    author: "Jacob Taarnhøj",
    date: "7 days ago",
    mediaType: "Video",
    actions: [{ label: "Rent 39 kr" }, { label: "Buy 99 kr" }],
  },
  {
    id: 2,
    category: "Podcast",
    image: imageOne,
    title: "Tech Talks",
    author: "Nuebros",
    date: "6 days ago",
    mediaType: "Video",
    actions: [{ label: "Free", fullWidth: true }],
  },
  {
    id: 3,
    category: "Course",
    image: imageThree,
    title: "Vegetable recipes",
    author: "Kammas kantine",
    date: "10 days ago",
    mediaType: "Video",
    actions: [{ label: "Shop collection 99 kr", fullWidth: true }],
  },
  {
    id: 4,
    category: "Educational",
    image: imageFour,
    title: "ADD/ADHD",
    author: "Nate Hansen",
    date: "1 day ago",
    mediaType: "E-pub",
    actions: [{ label: "Buy xx kr", fullWidth: true }],
  },
];
