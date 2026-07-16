import { CREATOR_DELETION_REQUEST_STATUS } from "../utils/constants";

export type CreatorDeletionRequestStatus =
  (typeof CREATOR_DELETION_REQUEST_STATUS)[keyof typeof CREATOR_DELETION_REQUEST_STATUS];

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
