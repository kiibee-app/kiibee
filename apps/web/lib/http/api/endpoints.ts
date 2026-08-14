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
    deleteUser: "/auth/delete-user",
  },
  coupon: {
    create: "/coupons/create",
    getAll: "/coupons",
    getById: (id: string) => `/coupons/${id}`,
    update: (id: string) => `/coupons/${id}`,
    replace: (id: string) => `/coupons/${id}`,
    delete: (id: string) => `/coupons/${id}`,
    verify: "/coupons/verify",
  },
  media: {
    videoUpload: "/media/videos/upload",
    videoPartUrl: "/media/videos/part-url",
    videoComplete: "/media/videos/complete",
    videoStream: "/media/videos/stream",
    fileUploadUrl: "/media/file/upload-url",
    fileConfirm: "/media/file/confirm",
    fileSignedUrl: "/media/file/signed-url",
    imagesUpload: "/media/images/upload",
  },
  content: {
    create: "/content/create",
    all: "/content/all",
    categories: "/content/categories",
    types: "/content/types",
    collection: (id: string) => `/content/collection/${id}`,
    get: (id: string) => `/content/${id}`,
    view: (id: string, userId: string) => `/content/${id}/${userId}`,
    verifyCode: (id: string) => `/content/${id}/verify-code`,
    relatedCollection: (id: string) => `/content/${id}/related-collection`,
    publicCollection: (id: string, viewerId?: string) =>
      viewerId
        ? `/content/public/collection/${id}?viewerId=${viewerId}`
        : `/content/public/collection/${id}`,
    update: (id: string) => `/content/update/${id}`,
    delete: (id: string) => `/content/delete/${id}`,
    appearance: "/content/appearance",
    setting: "/content/setting",
  },
  collection: {
    getAll: "/collection",
    getPublicByCreator: (creatorId: string) =>
      `/collection/public/${creatorId}`,
    create: "/collection/create",
    update: (id: string) => `/collection/${id}`,
    delete: (id: string) => `/collection/${id}`,
  },
  creators: {
    list: "/creators",
    all: "/creators/all",
    byId: (id: string) => `/creators/${id}`,
  },
  feed: {
    explore: "/feed/explore",
    trending: "/feed/trending",
    recent: "/feed/recent",
  },
  tutorialVideos: {
    list: "/tutorial-videos",
    byId: (id: string) => `/tutorial-videos/${id}`,
  },
  creatorUsers: {
    registrations: "/creator-users/registrations",
    register: "/creator-users/register",
    requestContentAccess: "/creator-users/content-access/request",
    approveContentAccess: "/creator-users/content-access/approve",
    redeemContentAccess: "/creator-users/content-access/redeem",
    sales: "/creator-users/sales",
    deleteRegistration: (id: string) => `/creator-users/registrations/${id}`,
  },
  export: {
    request: "/export/request",
    sendReceipt: "/export/send-receipt",
  },
  creatorOverview: {
    contentPerformance: "/creator-overview/content-performance",
    analytics: "/creator-overview/analytics",
  },
  order: {
    create: "/order/create",
    createCollection: "/order/collection/create",
    getById: (orderId: string) => `/order/${orderId}`,
    billingHistory: "/order/billing-history",
    billingInvoice: (billingId: string) =>
      `/order/billing-history/${billingId}`,
    // confirmPayment: (orderId: string) => `/order/${orderId}/confirm-payment`,
  },
  subscription: {
    create: "/subscription/create",
    plans: "/subscription/plans",
    creatorPlan: "/subscription/creator/plan",
  },
  payout: {
    settlementHistory: "/payout/settlement-history",
    stats: "/payout/stats",
    calculate: "/payout/calculate",
    request: "/payout/request",
  },
  payment: {
    cards: "/payment/cards",
    cardAdd: "/payment/card/add",
    card: (subscriptionId: string) => `/payment/card/${subscriptionId}`,
    cardDefault: (cardId: string) => `/payment/card/default/${cardId}`,
  },
  support: {
    contact: "/support/contact",
  },
  notificationSettings: {
    get: "/notification-settings",
    update: "/notification-settings",
  },
  viewer: {
    purchasedData: "/viewer/purchased-data",
    rentedData: "/viewer/rented-data",
    previouslyRentedData: "/viewer/previously-rented-data",
    accessibleContentIds: "/viewer/accessible-content-ids",
    paymentMethods: "/viewer/payment-methods",
    paymentMethod: (id: string) => `/viewer/payment-methods/${id}`,
    paymentMethodDefault: (id: string) =>
      `/viewer/payment-methods/${id}/default`,
  },
  download: {
    limit: "/download/limit",
    url: (contentId: string) => `/download/url?contentId=${contentId}`,
    contentInfo: (contentId: string) =>
      `/download/content-info?contentId=${contentId}`,
  },
} as const;
