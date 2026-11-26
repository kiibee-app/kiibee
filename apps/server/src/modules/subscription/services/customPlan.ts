/** Reserved admin-only plan. Billing and limits come from creator overrides. */
export const CUSTOM_PLAN_ID = 'c0570000-0000-4000-8000-000000000001';
export const CUSTOM_PLAN = {
  id: CUSTOM_PLAN_ID,
  name: 'Custom',
  price: 0,
  currency: 'DKK',
  billingCycle: 'monthly',
  maxFiles: 0,
  isActive: false,
};
