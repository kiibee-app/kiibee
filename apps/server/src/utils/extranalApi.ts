export const externalApi = {
  getBillingAgreements: `${process.env.EPAY_BASE_URL}/public/api/v1/subscriptions/billing/agreements`,
  stopAgreement: (billingAgreementId: string) =>
    `${process.env.EPAY_BASE_URL}/public/api/v1/subscriptions/billing/agreements/${billingAgreementId}/stop`,
};
