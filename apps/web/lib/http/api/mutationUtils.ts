"use client";

import { REQUEST_TIMEOUT } from "@/lib/http/config";
import { normalizeApiError } from "@/lib/http/errors/apiError";

export async function withMutationGuards<T>(
  caller: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    return await caller(controller.signal);
  } catch (error) {
    throw normalizeApiError(error);
  } finally {
    clearTimeout(timeout);
  }
}
