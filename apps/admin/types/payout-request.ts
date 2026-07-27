export interface PayoutRequest {
  id: string;
  payoutId: string;
  creatorId: string;
  paymentMethodId: string;
  rawAmount: string;
  processingFee: string;
  platformFee: string;
  payableAmount: string;
  currency: string;
  status: string;
  createdAt: string;
  email: string;
  fullName: string;
  walletBalance: string | null;
  walletCurrency: string | null;
}

export type PayoutCreatePayload = {
  requestId: string;
  creatorId: string;
  amount: string;
  payoutId: string;
  paymentMethodId: string;
};

export interface PayoutHistoryItem {
  id: string;
  creatorId?: string;
  creatorEmail?: string | null;
  creatorFullName?: string | null;
  payoutRequestId?: string | null;
  rawAmount?: string | null;
  amount?: string | null;
  currency?: string | null;
  status: string;
  creditNo?: string | null;
  cardNo?: string | null;
  bankAccountInfo?: unknown;
  payoutDate?: string | null;
  paymentMethodId?: string | null;
  processingFee?: string | null;
  platformFee?: string | null;
  payableAmount?: string | null;
  createdAt?: string | null;
}

export interface AllPayoutHistoryResponse {
  items: PayoutHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PayoutHistoryQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export type PayoutTab =
  | "balances"
  | "requests"
  | "creator-history"
  | "all-history";
export type BadgeStatus = "approved" | "pending" | "rejected";

export interface CreatorWalletPaymentMethod {
  id: string;
  label: string;
  type: "bank" | "card";
  isDefault: boolean;
}

export interface CreatorWalletItem {
  creatorId: string;
  email: string;
  fullName: string | null;
  walletBalance: string;
  walletCurrency: string;
  pendingRequestId: string | null;
  hasPendingRequest: boolean;
  paymentMethods: CreatorWalletPaymentMethod[];
  hasPaymentMethod: boolean;
}

export interface CreatorWalletsResponse {
  items: CreatorWalletItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface AdminPayoutCalculateResponse {
  amount: number;
  walletBalance: number;
  walletCurrency: string;
  planPrice: number;
  platformFeePercentage: number;
  processingFeePercentage: number;
  platformFee: number;
  processingFee: number;
  payableAmount: number;
}

export type AdminPayoutRequestPayload = {
  creatorId: string;
  paymentMethodId: string;
  amount?: number;
  processImmediately?: boolean;
};

export type AdminPayoutRequestResult = {
  payoutId: string;
  payoutRequestId: string;
  requestCreated: boolean;
  processed: boolean;
  processError?: string;
  amount?: number;
  platformFee?: number;
  processingFee?: number;
  payableAmount?: number;
};
