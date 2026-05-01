export type CreatorStatus = "pending" | "approved" | "rejected";

export type CreatorRequest = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  cvr: string;
  address: string;
  city: string;
  postalCode: string;
  exampleWorkLink: string;
  createdAt: string;
  updatedAt: string;
  contentDescription: string;
  status: CreatorStatus;
  approvedUserId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
};

export type CreatorResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreatorRequest[];
};
