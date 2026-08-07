import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT } from "@/lib/http/config";
import { attachRequestInterceptor } from "@/lib/http/interceptors/request.interceptor";
import { attachResponseInterceptor } from "@/lib/http/interceptors/response.interceptor";
import {
  XSRF_COOKIE_NAME,
  XSRF_HEADER_NAME,
  HEADER_CONTENT_TYPE,
  HEADER_X_REQUESTED_WITH,
  HEADER_X_CSRF_TOKEN,
  VALUE_APPLICATION_JSON,
  VALUE_XML_HTTP_REQUEST,
  CSRF_COOKIE_REGEX,
  STATE_CHANGING_HTTP_METHODS,
} from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
  xsrfCookieName: XSRF_COOKIE_NAME,
  xsrfHeaderName: XSRF_HEADER_NAME,
  headers: {
    [HEADER_CONTENT_TYPE]: VALUE_APPLICATION_JSON,
    [HEADER_X_REQUESTED_WITH]: VALUE_XML_HTTP_REQUEST,
  },
});

axiosClient.interceptors.request.use((config) => {
  if (isBrowser) {
    const method = config.method?.toUpperCase();

    if (method && STATE_CHANGING_HTTP_METHODS.includes(method)) {
      const match = document.cookie.match(CSRF_COOKIE_REGEX);
      const csrfToken = match ? decodeURIComponent(match[1]) : null;

      if (csrfToken) {
        config.headers[HEADER_X_CSRF_TOKEN] = csrfToken;
      }
    }
  }
  return config;
});

attachRequestInterceptor(axiosClient);
attachResponseInterceptor(axiosClient);

export const useAxios = () => axiosClient;
