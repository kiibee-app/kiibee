import React, { createContext, useContext } from "react";
import { useSubscriptionFlow } from "@/hooks/useSubscriptionFlow";
import type {
  SubscriptionContextValue,
  SubscriptionStep,
} from "@/types/subscription";

const defaultContextValue = {} as SubscriptionContextValue;

const SubscriptionContext =
  createContext<SubscriptionContextValue>(defaultContextValue);

export const SubscriptionProvider = ({
  children,
  setupToken,
  initialStep,
  initialPlanId,
}: {
  children: React.ReactNode;
  setupToken?: string | null;
  initialStep?: SubscriptionStep;
  initialPlanId?: string | null;
}) => {
  const value = useSubscriptionFlow(
    setupToken ?? undefined,
    initialStep,
    initialPlanId,
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  return useContext(SubscriptionContext);
};
