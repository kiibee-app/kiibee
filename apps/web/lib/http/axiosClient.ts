import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT } from "@/lib/http/config";
import { attachRequestInterceptor } from "@/lib/http/interceptors/request.interceptor";
import { attachResponseInterceptor } from "@/lib/http/interceptors/response.interceptor";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

attachRequestInterceptor(axiosClient);
attachResponseInterceptor(axiosClient);

export const useAxios = () => axiosClient;
