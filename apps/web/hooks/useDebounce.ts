import { useState, useEffect } from "react";
import { DEFAULT_DEBOUNCE_DELAY } from "@/utils/Constants";

export function useDebounce<T>(
  value: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
