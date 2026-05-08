import React, { createContext, useContext } from "react";
import { useSubscriptionFlow } from "@/hooks/useSubscriptionFlow";
import type { SubscriptionContextValue } from "@/types/subscription";

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined,
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useSubscriptionFlow();

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = (): SubscriptionContextValue => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider",
    );
  }
  return context;
};
