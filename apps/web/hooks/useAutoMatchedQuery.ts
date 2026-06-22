"use client";

import { useCallback, useRef } from "react";

type SetSearchValue = (value: string) => void;

export function useAutoMatchedQuery(setSearchValue: SetSearchValue) {
  const lastAutoMatchedQueryRef = useRef("");

  const handleSearchChange = useCallback(
    (value: string) => {
      if (!value.trim()) {
        lastAutoMatchedQueryRef.current = "";
      }

      setSearchValue(value);
    },
    [setSearchValue],
  );

  return {
    lastAutoMatchedQueryRef,
    handleSearchChange,
  };
}
