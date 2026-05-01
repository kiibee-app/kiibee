export type CollectionRow = {
  id: string;
  name: string;
  contentsCount: number;
  createdAt: string;
  actions: string;
};

export type CollectionsTableProps = {
  data: CollectionRow[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMore?: (id: string) => void;
};

export const collectionsData: CollectionRow[] = [
  {
    id: "1",
    name: "Health Conscious",
    contentsCount: 12,
    createdAt: "August 9, 2019",
    actions: "",
  },
  {
    id: "2",
    name: "Instructional videos",
    contentsCount: 8,
    createdAt: "August 15, 2019",
    actions: "",
  },
  {
    id: "3",
    name: "Audio files and Podcasts",
    contentsCount: 16,
    createdAt: "July 3, 2019",
    actions: "",
  },
  {
    id: "4",
    name: "Other contents",
    contentsCount: 5,
    createdAt: "November 27, 2019",
    actions: "",
  },
  {
    id: "5",
    name: "Books of Psychology",
    contentsCount: 8,
    createdAt: "August 27, 2019",
    actions: "",
  },
  {
    id: "6",
    name: "Important web pages",
    contentsCount: 23,
    createdAt: "October 28, 2025",
    actions: "",
  },
];
