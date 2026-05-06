"use client";

import { API } from "@/lib/http/api/endpoints";
import { usePostAPI } from "@/lib/http/api/postApi";

export type ForgetPasswordPayload = {
  email: string;
};

export type ForgetPasswordResponse = {
  success: boolean;
  message: string;
};

export const useForgetPassword = () =>
  usePostAPI<ForgetPasswordResponse, ForgetPasswordPayload>(
    API.auth.forgetPassword,
  );
