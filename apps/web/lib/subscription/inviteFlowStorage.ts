const CREATOR_INVITE_POST_PAYMENT_KEY = "creator-invite-post-payment";

export type CreatorInvitePostPaymentState = {
  token: string;
  planId: string;
};

export const saveCreatorInvitePostPayment = (
  state: CreatorInvitePostPaymentState,
) => {
  sessionStorage.setItem(
    CREATOR_INVITE_POST_PAYMENT_KEY,
    JSON.stringify(state),
  );
};

export const readCreatorInvitePostPayment =
  (): CreatorInvitePostPaymentState | null => {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem(CREATOR_INVITE_POST_PAYMENT_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as CreatorInvitePostPaymentState;
    } catch {
      return null;
    }
  };

export const clearCreatorInvitePostPayment = () => {
  sessionStorage.removeItem(CREATOR_INVITE_POST_PAYMENT_KEY);
};
