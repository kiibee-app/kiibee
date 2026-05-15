export type SubscriptionPlan = {
  id: string;
  nameKey: string;
  metaKey: string;
  priceKey: string;
};

export const FREE_SUBSCRIPTION_PLAN_ID = "try-kiibee" as const;

export const isFreeSubscriptionPlan = (planId: string) =>
  planId === FREE_SUBSCRIPTION_PLAN_ID;

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "try-kiibee",
    nameKey: "subscriptionPage.plans.tryKiibee.name",
    metaKey: "subscriptionPage.plans.tryKiibee.meta",
    priceKey: "subscriptionPage.plans.tryKiibee.price",
  },
  {
    id: "start-up",
    nameKey: "subscriptionPage.plans.startUp.name",
    metaKey: "subscriptionPage.plans.startUp.meta",
    priceKey: "subscriptionPage.plans.startUp.price",
  },
  {
    id: "pro",
    nameKey: "subscriptionPage.plans.pro.name",
    metaKey: "subscriptionPage.plans.pro.meta",
    priceKey: "subscriptionPage.plans.pro.price",
  },
];
