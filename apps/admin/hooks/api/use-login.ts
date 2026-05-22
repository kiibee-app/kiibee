import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { LoginPayload, LoginResponse } from "../../types/api";
import { API_ENDPOINTS, ERROR_MESSAGES } from "../../utils/constants";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient<LoginResponse>(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.success) {
        throw new Error(response.message || ERROR_MESSAGES.LOGIN_FAILED);
      }

      if (!response.data) {
        throw new Error("Login response data is missing");
      }

      return response.data;
    },
  });
}
