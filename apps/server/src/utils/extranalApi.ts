export const externalApi = {
  getBillingAgreements: `${process.env.EPAY_API_URL}/public/api/v1/subscriptions/billing/agreements`,
  stopAgreement: (billingAgreementId: string) =>
    `${process.env.EPAY_API_URL}/public/api/v1/subscriptions/billing/agreements/${billingAgreementId}/stop`,
};
