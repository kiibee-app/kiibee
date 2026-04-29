import axios, { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string | string[];
  statusCode?: number;
  error?: string;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  payload?: unknown;

  constructor(
    message: string,
    status?: number,
    code?: string,
    payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

const getMessage = (data: unknown, fallback: string) => {
  const payload = data as ApiErrorPayload | undefined;
  const message = payload?.message;

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  return payload?.error ?? fallback;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isCancel(error)) {
    return new ApiError("Request was cancelled", undefined, "ERR_CANCELED");
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const status = axiosError.response?.status;
    const payload = axiosError.response?.data;
    const message = getMessage(payload, axiosError.message || "Request failed");

    return new ApiError(message, status, axiosError.code, payload);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Something went wrong");
};
