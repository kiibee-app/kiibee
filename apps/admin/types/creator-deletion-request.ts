export type CreatorDeletionRequestStatus = "pending" | "approved" | "rejected";

export type CreatorDeletionRequestUser = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type CreatorDeletionRequest = {
  id: string;
  status: CreatorDeletionRequestStatus;
  approvedUserId: string | null;
  createdAt: string;
  updatedAt: string;
  user: CreatorDeletionRequestUser;
};
