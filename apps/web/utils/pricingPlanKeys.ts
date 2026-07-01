export type PlanKey = "launch" | "growth" | "pro";
export const planOrder: PlanKey[] = ["launch", "growth", "pro"];

export const pricingPlanToPlanName: Record<PlanKey, string> = {
  launch: "Try Kiibee",
  growth: "Start-up",
  pro: "Pro",
};
