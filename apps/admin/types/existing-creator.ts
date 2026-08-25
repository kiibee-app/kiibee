export type ExistingCreatorStatus =
  | "pending-setup"
  | "active"
  | "inactive"
  | "suspended"
  | "deleted";

export type ExistingCreator = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  role: string;
  status: ExistingCreatorStatus;
  isEmailVerified: boolean;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  companyName: string | null;
  phone: string | null;
  city: string | null;
  cvr: string | null;
  channelName: string | null;
  channelSlug: string | null;
  isPublished: boolean | null;
  isHidden: boolean;
  layout: string | null;
  planName: string | null;
  uploadCount: number;
  subscriberCount: number;
};

export type ExistingCreatorsResponse = {
  items: ExistingCreator[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
