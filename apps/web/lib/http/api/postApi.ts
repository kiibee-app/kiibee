"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { withMutationGuards } from "@/lib/http/api/mutationUtils";
import { ApiError } from "@/lib/http/errors/apiError";
import type { MutationOptionsKey } from "@/types/apiClientTypes";

export const usePostAPI = <T, B = unknown>(
  route: string,
  options?: Omit<UseMutationOptions<T, ApiError, B>, MutationOptionsKey>,
) =>
  useMutation<T, ApiError, B>({
    mutationKey: [route],
    mutationFn: (body) =>
      withMutationGuards((signal) =>
        axiosClient
          .post<T>(route, body, { signal })
          .then((response) => response.data),
      ),
    ...options,
  });
