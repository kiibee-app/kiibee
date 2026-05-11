import { authStorage } from "@/lib/auth/authStorage";

export const useAuthSession = () => {
  return authStorage;
};
