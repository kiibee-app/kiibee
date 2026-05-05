import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import {
  clearAuthSession,
  getRefreshToken,
  persistAuthSession,
} from "@/lib/auth/authSession";
import { API } from "@/lib/http/api/endpoints";
import { normalizeApiError } from "@/lib/http/errors/apiError";
import { PATHS } from "@/utils/path";
import { HTTP_STATUS_UNAUTHORIZED } from "@/utils/Constants";

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
  };
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

const clearSessionAndRedirectToLogin = () => {
  if (typeof window === "undefined") return;

  clearAuthSession();

  if (window.location.pathname !== PATHS.AUTH_LOGIN) {
    window.location.replace(PATHS.AUTH_LOGIN);
  }
};

const refreshAccessToken = async (
  client: AxiosInstance,
): Promise<string | null> => {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return Promise.reject(new Error("Missing refresh token"));
    }

    refreshPromise = client
      .post<RefreshResponse>(API.auth.refresh, { refreshToken })
      .then((response: AxiosResponse<RefreshResponse>) => {
        const nextAccessToken = persistAuthSession(response.data);

        if (!nextAccessToken) {
          throw new Error("Refresh response missing access token");
        }

        return nextAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const attachResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(normalizeApiError(error));
      }

      const status = error.response?.status;
      const originalRequest = error.config as
        | RetriableRequestConfig
        | undefined;
      const requestUrl = originalRequest?.url ?? "";
      const isRefreshRequest = requestUrl.includes(API.auth.refresh);

      if (
        status !== HTTP_STATUS_UNAUTHORIZED ||
        !originalRequest ||
        originalRequest._retry ||
        isRefreshRequest
      ) {
        return Promise.reject(normalizeApiError(error));
      }

      originalRequest._retry = true;

      try {
        const refreshedAccessToken = await refreshAccessToken(client);

        if (!refreshedAccessToken) {
          throw new Error("Unable to refresh access token");
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;

        return client(originalRequest);
      } catch {
        clearSessionAndRedirectToLogin();
        return Promise.reject(normalizeApiError(error));
      }
    },
  );
};
