import { z } from "zod";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

export type LoginFormMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

export const createLoginFormSchema = ({
  emailRequired,
  emailInvalid,
  passwordRequired,
}: LoginFormMessages) =>
  z.object({
    email: z.string().trim().min(1, emailRequired).email(emailInvalid),
    password: z.string().trim().min(1, passwordRequired),
  });
