import { API_BASE_URL } from "../../utils/api";
import type { ApiResponse } from "../../types/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  setTokens,
} from "../../utils/token";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = (await response.json()) as ApiResponse<RefreshResponse>;

    if (!response.ok || !data.success || !data.data) {
      clearTokens();
      return null;
    }

    setTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const isAuthLoginEndpoint = endpoint === "/auth/login";
  const isAuthRefreshEndpoint = endpoint === "/auth/refresh";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (
    typeof window !== "undefined" &&
    !isAuthLoginEndpoint &&
    !isAuthRefreshEndpoint
  ) {
    let token = getAccessToken();

    if (token && isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  let response = await fetch(url, config);

  if (
    response.status === 401 &&
    typeof window !== "undefined" &&
    !isAuthLoginEndpoint &&
    !isAuthRefreshEndpoint
  ) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      headers["Authorization"] = `Bearer ${refreshedToken}`;
      response = await fetch(url, {
        ...config,
        headers,
      });
    }
  }

  const data = await response.json();

  return data as ApiResponse<T>;
}
