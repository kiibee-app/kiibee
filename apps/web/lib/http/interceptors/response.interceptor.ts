import type { AxiosInstance } from "axios";
import { normalizeApiError } from "@/lib/http/errors/apiError";

export const attachResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeApiError(error)),
  );
};
