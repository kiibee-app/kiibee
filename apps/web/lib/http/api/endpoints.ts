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
  media: {
    videoInit: "/media/videos/init",
    videoPartUrl: "/media/videos/part-url",
    videoComplete: "/media/videos/complete",
    fileUploadUrl: "/media/file/upload-url",
    fileConfirm: "/media/file/confirm",
  },
  collection: {
    getAll: "/collection",
    create: "/collection/create",
    update: (id: string) => `/collection/${id}`,
    delete: (id: string) => `/collection/${id}`,
  },
} as const;
