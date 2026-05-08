import React, { createContext, useContext } from "react";
import { useSubscriptionFlow } from "@/hooks/useSubscriptionFlow";
import type { SubscriptionContextValue } from "@/types/subscription";

const defaultContextValue = {} as SubscriptionContextValue;

const SubscriptionContext =
  createContext<SubscriptionContextValue>(defaultContextValue);

export const SubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useSubscriptionFlow();

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  return useContext(SubscriptionContext);
};
