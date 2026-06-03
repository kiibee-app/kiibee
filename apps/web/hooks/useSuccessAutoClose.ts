import { useEffect, useRef } from "react";

type Params = {
  isSuccess: boolean;
  onClose?: () => void;
  delay?: number;
};

export function useSuccessAutoClose({
  isSuccess,
  onClose,
  delay = 1500,
}: Params) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onCloseRef.current?.();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, delay]);
}
