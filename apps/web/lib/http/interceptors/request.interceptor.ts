import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API } from "@/lib/http/api/endpoints";
import { authStorage } from "@/lib/auth/authStorage";
import {
  STATE_CHANGING_METHODS,
  UNDEFINED_VALUE,
  XSRF_COOKIE_NAME,
  XSRF_HEADER_NAME,
} from "@/utils/common";

const getCsrfTokenFromCookie = () => {
  if (typeof document === UNDEFINED_VALUE) return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${XSRF_COOKIE_NAME}=`);
  if (parts.length === 2) return parts[1].split(";")[0];
  return null;
};

export const attachRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const requestUrl = config.url ?? "";
    const isRefreshRequest = requestUrl.includes(API.auth.refresh);
    const token = authStorage.getAccessToken();

    if (token && !isRefreshRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      config.method &&
      STATE_CHANGING_METHODS.includes(config.method.toLowerCase())
    ) {
      const csrfToken = getCsrfTokenFromCookie();

      if (csrfToken) {
        config.headers[XSRF_HEADER_NAME] = decodeURIComponent(csrfToken);
      }
    }

    return config;
  });
};
