export type CreatorContentItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  contentType: string | null;
  accessType: string | null;
  visibility: string | null;
  isPublished: boolean;
  buyPrice: string | number | null;
  rentPrice: string | number | null;
  createdAt: string;
  publishedAt: string | null;
  purchaseCount: number;
  rentalCount: number;
  downloadCount: number;
};

export type ContentEngagementUser = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  date: string;
  displayDate: string;
  rentExpiresAt?: string | null;
  rentExpiresDisplay?: string | null;
};

export type ContentEngagement = {
  content: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    contentType: string | null;
    accessType: string | null;
    visibility: string | null;
    isPublished: boolean;
    buyPrice: string | number | null;
    rentPrice: string | number | null;
    creatorId: string;
    createdAt: string;
    publishedAt: string | null;
  };
  purchases: ContentEngagementUser[];
  rentals: ContentEngagementUser[];
  downloads: ContentEngagementUser[];
  stats: {
    purchaseCount: number;
    rentalCount: number;
    downloadCount: number;
  };
};
