export type TutorialVideo = {
  id: string;
  title: string;
  category: string;
  creator: string;
  published: string;
  focus: string;
  level: string;
  formatLabel: string;
  image: string;
};

export const tutorialVideos: TutorialVideo[] = [
  {
    id: "del-2",
    title: "Del 2. Indhold og udsende",
    category: "Design",
    creator: "Kiibee",
    published: "9 months ago",
    focus: "Plan content, scenes, and publishing cadence before you go live.",
    level: "Free",
    formatLabel: "Video",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "del-3",
    title: "Del 3: Styling og styring af flow",
    category: "Design",
    creator: "Kiibee",
    published: "4 days ago",
    focus:
      "Fine-tune the look and pacing of your livestream and on-demand drops.",
    level: "Free",
    formatLabel: "Video",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "del-4",
    title: "Del 4: Betalingsmodul og sikkerhed",
    category: "Educational",
    creator: "Kiibee",
    published: "1 year ago",
    focus:
      "Connect billing, payouts, and compliance tools for a smooth launch.",
    level: "Free",
    formatLabel: "Video",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "del-5",
    title: "Del 5: Udbetaling, notifikationer",
    category: "Design",
    creator: "Kiibee",
    published: "9 days ago",
    focus: "Automate payouts and keep creators informed with clean alerts.",
    level: "Free",
    formatLabel: "Video",
    image:
      "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=1200&q=80",
  },
];
