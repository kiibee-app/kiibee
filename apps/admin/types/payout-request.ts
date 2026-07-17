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
