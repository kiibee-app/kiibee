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
  fullName: string | null;
  email: string;
  role: string;
  isEmailVerified: boolean;
  status: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfileResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  status: string;
  downloadsCount?: number;
}
