export type SubscriptionPlan = {
  id: string;
  labelKey: string;
  priceKey: string;
  metaKey: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "try-kiibee",
    labelKey: "subscriptionPage.plans.tryKiibee.label",
    priceKey: "subscriptionPage.plans.tryKiibee.price",
    metaKey: "subscriptionPage.plans.tryKiibee.meta",
  },
  {
    id: "start-up",
    labelKey: "subscriptionPage.plans.startUp.label",
    priceKey: "subscriptionPage.plans.startUp.price",
    metaKey: "subscriptionPage.plans.startUp.meta",
  },
  {
    id: "pro",
    labelKey: "subscriptionPage.plans.pro.label",
    priceKey: "subscriptionPage.plans.pro.price",
    metaKey: "subscriptionPage.plans.pro.meta",
  },
];

export const DEFAULT_SUBSCRIPTION_PLAN = subscriptionPlans[1].id;
