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

export type CreatorUsersListResponse<T> = {
  success?: boolean;
  data?: T[];
};
