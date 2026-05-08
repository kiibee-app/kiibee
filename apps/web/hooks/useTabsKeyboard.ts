import { useRef } from "react";
import { KEYBOARD_KEYS } from "@/utils/ui";

type TabItem = {
  key: string;
};

type UseTabsKeyboardOptions<T extends string> = {
  tabs: TabItem[];
  onTabChange: (key: T) => void;
};

export function useTabsKeyboard<T extends string>({
  tabs,
  onTabChange,
}: UseTabsKeyboardOptions<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_RIGHT:
        e.preventDefault();
        nextIndex = (index + 1) % tabs.length;
        break;
      case KEYBOARD_KEYS.ARROW_LEFT:
        e.preventDefault();
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case KEYBOARD_KEYS.HOME:
        e.preventDefault();
        nextIndex = 0;
        break;
      case KEYBOARD_KEYS.END:
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
    }

    if (nextIndex !== null) {
      onTabChange(tabs[nextIndex].key as T);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return { tabRefs, handleTabKeyDown };
}
