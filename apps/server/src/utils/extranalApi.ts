export const stripUrlPort = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
};

export const externalApi = {
  getBillingAgreements: `${process.env.EPAY_BASE_URL}/public/api/v1/subscriptions/billing/agreements`,
  stopAgreement: (billingAgreementId: string) =>
    `${process.env.EPAY_BASE_URL}/public/api/v1/subscriptions/billing/agreements/${billingAgreementId}/stop`,
};
