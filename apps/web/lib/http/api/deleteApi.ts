"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { withMutationGuards } from "@/lib/http/api/mutationUtils";
import { ApiError } from "@/lib/http/errors/apiError";
import type { MutationOptionsKey } from "@/types/apiClientTypes";

export const useDeleteAPI = <T, B = unknown>(
  route: string,
  options?: Omit<
    UseMutationOptions<T, ApiError, B | undefined>,
    MutationOptionsKey
  >,
) =>
  useMutation<T, ApiError, B | undefined>({
    mutationKey: [route],
    mutationFn: (body) =>
      withMutationGuards((signal) =>
        axiosClient
          .delete<T>(route, { data: body, signal })
          .then((response) => response.data),
      ),
    ...options,
  });
