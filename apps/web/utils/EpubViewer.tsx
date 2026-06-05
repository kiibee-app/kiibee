"use client";

import { useEffect, useRef } from "react";
import ePub from "epubjs";

export default function EpubViewer({ src }: { src: string }) {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src || !viewerRef.current) return;

    const book = ePub(src);

    book.ready.then(() => {
      const spine = book.spine as unknown as { length: number };
      const spineLength = spine.length;
      const isMultiPage = spineLength > 1;

      const rendition = book.renderTo(viewerRef.current!, {
        width: "100%",
        height: "100%",
        flow: isMultiPage ? "scrolled-doc" : "paginated",
        manager: isMultiPage ? "continuous" : "default",
      });

      rendition.display();
    });
  }, [src]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100%" }} />;
}
