export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  status: string;
  accessToken: string;
  refreshToken: string;
}
