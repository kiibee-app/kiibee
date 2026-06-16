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
  city: string | null;
  purchaseCount: number;
  rentalCount: number;
};
