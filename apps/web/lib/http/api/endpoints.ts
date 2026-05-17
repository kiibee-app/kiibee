export const API = {
  auth: {
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    login: "/auth/login",
    forgetPassword: "/auth/forget-password",
    resetPassword: "/auth/reset-password",
    creatorRequest: "/auth/creator-request",
    creatorSetup: "/auth/creator/setup",
    signup: "/auth/signup",
    userProfile: "/auth/user/profile",
    changePassword: "/auth/user/password",
    creatorProfile: "/auth/creator/profile",
  },
  coupon: {
    create: "/coupons/create",
    getAll: "/coupons",
  },
} as const;
