export type ProfileForm = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  cvr: string;
  address: string;
  city: string;
  postal: string;
  reg: string;
  account: string;
  email: string;
};

export type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};
