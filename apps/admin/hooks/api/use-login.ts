import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { LoginPayload, LoginResponse } from "../../types/api";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      if (!response.data) {
        throw new Error("Login response data is missing");
      }

      return response.data;
    },
  });
}
