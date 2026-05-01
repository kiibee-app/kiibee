export type PasswordState = {
  newPassword: string;
  repeatPassword: string;
};

export type VisibilityState = {
  newPassword: boolean;
  repeatPassword: boolean;
};

export const INITIAL_PASSWORDS: PasswordState = {
  newPassword: "",
  repeatPassword: "",
};

export const INITIAL_VISIBILITY: VisibilityState = {
  newPassword: false,
  repeatPassword: false,
};

export const getResetPasswordFields = () => [
  {
    key: "newPassword" as const,
    label: "resetPassword.newPasswordLabel",
    placeholder: "resetPassword.newPasswordPlaceholder",
  },
  {
    key: "repeatPassword" as const,
    label: "resetPassword.repeatPasswordLabel",
    placeholder: "resetPassword.repeatPasswordPlaceholder",
  },
];
