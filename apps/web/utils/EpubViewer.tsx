"use client";

import { useEffect, useRef } from "react";
import ePub from "epubjs";

export default function EpubViewer({ src }: { src: string }) {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src || !viewerRef.current) return;

    const container = viewerRef.current;
    let cancelled = false;
    let rendition: ReturnType<ReturnType<typeof ePub>["renderTo"]> | null =
      null;
    const book = ePub(src);

    book.ready
      .then(() => {
        if (cancelled || !container) return;

        const spine = book.spine as unknown as { length: number };
        const spineLength = spine.length;
        const isMultiPage = spineLength > 1;

        rendition = book.renderTo(container, {
          width: "100%",
          height: "100%",
          flow: isMultiPage ? "scrolled-doc" : "paginated",
          manager: isMultiPage ? "continuous" : "default",
        });

        return rendition.display();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      rendition?.destroy();
      book.destroy?.();
      container.innerHTML = "";
    };
  }, [src]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100%" }} />;
}
