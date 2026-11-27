export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  twoFactorCode?: string;
  recoveryCode?: string;
}

export interface AdminMfaChallenge {
  requiresTwoFactor: true;
  setupRequired: boolean;
  setupKey?: string;
  accountName?: string;
}

export type LoginResponse = LoginSuccess | AdminMfaChallenge;

export interface LoginSuccess {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  isEmailVerified: boolean;
  status: string;
  accessToken: string;
  refreshToken: string;
  recoveryCodes?: string[];
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
