"use client";

import { API, usePostAPI } from "@/lib/http/api";

export type ViewerSignUpBody = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ViewerSignUpResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    isEmailVerified?: boolean;
    accessToken?: string;
    refreshToken?: string;
  };
};

export const useViewerSignUp = () => {
  return usePostAPI<ViewerSignUpResponse, ViewerSignUpBody>(API.auth.signup);
};
