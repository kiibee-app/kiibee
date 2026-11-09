"use client";

import { useEffect, useRef, useState } from "react";

export function useTextOverflow(text: string) {
  const textRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const measure = () => {
      setHasOverflow(element.scrollHeight > element.clientHeight + 1);
    };
    let frame = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleMeasure)
        : null;

    scheduleMeasure();
    observer?.observe(element);
    window.addEventListener("resize", scheduleMeasure);
    document.fonts?.addEventListener("loadingdone", scheduleMeasure);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      document.fonts?.removeEventListener("loadingdone", scheduleMeasure);
    };
  }, [text]);

  return { textRef, hasOverflow };
}
