"use client";

import { API } from "@/lib/http/api/endpoints";
import { usePostAPI } from "@/lib/http/api/postApi";

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export const useResetPassword = () =>
  usePostAPI<ResetPasswordResponse, ResetPasswordPayload>(
    API.auth.resetPassword,
  );
