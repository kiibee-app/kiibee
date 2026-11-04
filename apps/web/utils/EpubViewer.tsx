"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Contents, Rendition, Location } from "epubjs";
import styled from "styled-components";
import { openRangeEpub } from "@/utils/rangeEpub";
import GenericSpinner from "@/components/UI/GenericSpinner";
import {
  Reader,
  Toolbar,
  PageControls,
  Status,
} from "@/components/UI/PdfViewer/styles";

const ReadingArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
  .epub-container {
    overscroll-behavior: contain;
    scrollbar-gutter: stable both-edges;
  }
  .epub-view {
    margin-left: 0 !important;
  }
`;

export default function EpubViewer({ src }: { src: string }) {
  const { t } = useTranslation();
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [phase, setPhase] = useState<
    "download" | "index" | "prepare" | "ready" | "error"
  >("download");
  const [position, setPosition] = useState({
    chapter: 1,
    total: 0,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!src || !viewerRef.current) return;
    const container = viewerRef.current;
    const controller = new AbortController();
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const fail = () => {
      if (!cancelled) {
        setPhase("error");
      }
    };

    void (async () => {
      const opened = await openRangeEpub(src, controller.signal, (phase) => {
        if (!cancelled) setPhase(phase);
      });
      dispose = opened.dispose;
      const { book } = opened;
      if (cancelled) {
        dispose();
        return;
      }
      setPhase("prepare");
      const settings = {
        width: "100%",
        height: "100%",
        flow: "scrolled-continuous",
        manager: "continuous",
        spread: "none",
        offset: container.clientHeight * 2,
      };
      const rendition = book.renderTo(container, settings);
      // EPUB.js aligns fixed-layout pages to alternating print-spread edges.
      // In a vertical reader each scaled page has its own centered row.
      if (book.packaging.metadata.layout === "pre-paginated") {
        rendition.hooks.content.register((contents: Contents) => {
          contents.css("clip-path", "inset(0)", true);
          const center = () => {
            const width = contents.content.getBoundingClientRect().width;
            const inset = Math.max(0, (contents.window.innerWidth - width) / 2);
            contents.css("margin-left", `${inset}px`, true);
          };
          center();
          contents.window.addEventListener("resize", center);
        });
      }
      renditionRef.current = rendition;
      rendition.on("displayError", fail);
      let firstPageReady = false;
      rendition.on("rendered", () => {
        if (cancelled || firstPageReady) return;
        firstPageReady = true;
        setPosition({ chapter: 1, total: book.packaging.spine.length });
        setPhase("ready");
      });
      rendition.on("relocated", (location: Location) => {
        if (cancelled || !location.start) return;
        setPosition({
          chapter: location.start.index + 1,
          total: book.packaging.spine.length,
        });
      });
      await rendition.display();
    })().catch(fail);

    return () => {
      cancelled = true;
      controller.abort();
      renditionRef.current?.destroy();
      renditionRef.current = null;
      dispose?.();
      container.replaceChildren();
    };
  }, [src, attempt]);

  return (
    <Reader>
      <Toolbar>
        <span>EPUB</span>
        {phase === "ready" && (
          <PageControls>
            <span>
              {position.chapter} / {position.total}
            </span>
          </PageControls>
        )}
      </Toolbar>
      <ReadingArea ref={viewerRef} />
      {phase !== "ready" && (
        <Status
          role={phase === "error" ? "alert" : "status"}
          style={{ top: 52, background: "white" }}
        >
          {phase !== "error" && (
            <GenericSpinner size={36} label={t(`epubViewer.${phase}`)} />
          )}
          {phase === "error" && (
            <>
              <p>{t("epubViewer.error")}</p>
              <button
                type="button"
                onClick={() => {
                  setPhase("download");
                  setAttempt((value) => value + 1);
                }}
              >
                {t("epubViewer.retry")}
              </button>
            </>
          )}
        </Status>
      )}
    </Reader>
  );
}
