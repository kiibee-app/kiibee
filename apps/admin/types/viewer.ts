export type ViewerStatus =
  | "pending-setup"
  | "active"
  | "inactive"
  | "suspended"
  | "deleted";

export type Viewer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  role: string;
  status: ViewerStatus;
  isEmailVerified: boolean;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  phone: string | null;
  cvr: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  purchaseCount: number;
  rentalCount: number;
};

export type ViewerMediaItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  creatorName: string | null;
  contentType: string | null;
  categoryName: string | null;
  purchasedAt: string | null;
  rentExpiresAt?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
};

export type ViewerCollectionItem = {
  id: string;
  name: string;
  coverImageUrl: string | null;
  description: string | null;
  creatorName: string | null;
  elementCount: number;
  purchasedAt: string | null;
};

export type ViewerContentData = {
  videos: ViewerMediaItem[];
  audios: ViewerMediaItem[];
  pdfs: ViewerMediaItem[];
  collections: ViewerCollectionItem[];
};

export type ViewerSale = {
  id: string;
  orderNumber: string;
  contentTitle: string;
  contentImage: string;
  creatorName: string;
  type: string;
  paymentDate: string;
  amount: string | number;
  paymentMethod: string | null;
  cardNumber: string | null;
};
