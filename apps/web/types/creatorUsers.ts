export type RegistrationRow = {
  id: string;
  name: string;
  email: string;
  date: string;
  action?: string;
};

export type SalesRow = {
  id: string;
  name: string;
  email: string;
  price: string;
  type: string;
  date: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type CreatorUsersListResponse<T> = {
  success?: boolean;
  data?: T[];
};

export type CreatorUsersSalesResponse = {
  success?: boolean;
  data?: {
    sales: SalesRow[];
    pagination: PaginationMeta;
  };
};
