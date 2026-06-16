"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { UserProfileResponse } from "../../types/api";
import { API_ENDPOINTS } from "../../utils/constants";

export function useAdminProfile() {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await apiClient<UserProfileResponse>(
        API_ENDPOINTS.USER_PROFILE,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to load admin profile");
      }

      if (!response.data) {
        throw new Error("Profile response data is missing");
      }

      return response.data;
    },
  });
}
