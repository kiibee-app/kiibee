import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API } from "@/lib/http/api/endpoints";
import { authStorage } from "@/lib/auth/authStorage";

export const attachRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const requestUrl = config.url ?? "";
    const isRefreshRequest = requestUrl.includes(API.auth.refresh);
    const token = authStorage.getAccessToken();

    if (token && !isRefreshRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";

    return config;
  });
};
