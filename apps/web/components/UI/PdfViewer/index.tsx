"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import GenericSpinner from "@/components/UI/GenericSpinner";
import { getPdfEmbedUrl } from "@/utils/media";
import "pdfjs-dist/web/pdf_viewer.css";
import {
  Page,
  PageLabel,
  Reader,
  ScrollArea,
  Toolbar,
  PageControls,
  Status,
} from "./styles";

const assets = `/pdfjs/${pdfjs.version}`;
pdfjs.GlobalWorkerOptions.workerSrc = `${assets}/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.rendererSrc = `${assets}/pdf.renderer.min.mjs`;

function PdfPage({
  document,
  number,
  width,
  root,
  enabled,
  onReady,
}: {
  document: PDFDocumentProxy;
  number: number;
  width: number;
  root: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  onReady?: () => void;
}) {
  const { t } = useTranslation();
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(number === 1);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState(210 / 297);

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        root: root.current,
        rootMargin: "150px",
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [root]);

  useEffect(() => {
    if (!visible || !width || !enabled) return;
    let cancelled = false;
    let render: RenderTask | undefined;
    let textLayer: pdfjs.TextLayer | undefined;
    void (async () => {
      const page = await document.getPage(number);
      if (cancelled || !canvas.current || !text.current) return;
      setReady(false);
      setFailed(false);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / base.width });
      setRatio(base.width / base.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const target = canvas.current;
      target.width = Math.ceil(viewport.width * dpr);
      target.height = Math.ceil(viewport.height * dpr);
      render = page.render({
        canvas: target,
        viewport,
        transform: [dpr, 0, 0, dpr, 0, 0],
      });
      await render.promise;
      if (cancelled) return;
      setReady(true);
      onReady?.();
      // Make text selectable after the page is already visible.
      const content = await page.getTextContent();
      if (cancelled || !text.current) return;
      text.current.replaceChildren();
      text.current.style.setProperty(
        "--total-scale-factor",
        String(viewport.scale),
      );
      text.current.style.setProperty("--scale-round-x", "1px");
      text.current.style.setProperty("--scale-round-y", "1px");
      textLayer = new pdfjs.TextLayer({
        textContentSource: content,
        container: text.current,
        viewport,
      });
      await textLayer.render();
    })().catch((error: unknown) => {
      if (!cancelled && !(error instanceof pdfjs.RenderingCancelledException))
        setFailed(true);
    });
    return () => {
      cancelled = true;
      render?.cancel();
      textLayer?.cancel();
    };
  }, [document, number, visible, width, enabled, onReady]);

  return (
    <Page
      ref={wrapper}
      style={{ width, aspectRatio: String(ratio) }}
      data-pdf-page={number}
    >
      <PageLabel>{t("pdfViewer.page", { number })}</PageLabel>
      {visible && (
        <>
          {!ready && !failed && (
            <Status>
              <GenericSpinner size={32} isLocal />
            </Status>
          )}
          {failed && <Status role="alert">{t("pdfViewer.pageError")}</Status>}
          <canvas
            ref={canvas}
            aria-label={t("pdfViewer.page", { number })}
            style={{ opacity: ready ? 1 : 0 }}
          />
          <div ref={text} className="textLayer" />
        </>
      )}
    </Page>
  );
}

export default function PdfViewer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const [native, setNative] = useState(false);
  const [fit, setFit] = useState<"page" | "width">("page");
  const [pageRatio, setPageRatio] = useState(210 / 297);
  const [activePage, setActivePage] = useState(1);
  const scrollFrame = useRef<number | null>(null);
  const [firstPageReady, setFirstPageReady] = useState(false);
  const onFirstPageReady = useCallback(() => setFirstPageReady(true), []);

  const goToPage = (number: number) => {
    const element = root.current;
    const page = element?.querySelector<HTMLElement>(
      `[data-pdf-page="${number}"]`,
    );
    if (!element || !page) return;
    element.scrollTo({ top: page.offsetTop - 24, behavior: "instant" });
    setActivePage(number);
  };

  const handleScroll = () => {
    if (scrollFrame.current !== null) return;
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = null;
      const element = root.current;
      if (!element) return;
      const top = element.getBoundingClientRect().top + 48;
      const page = Array.from(
        element.querySelectorAll<HTMLElement>("[data-pdf-page]"),
      ).find((item) => item.getBoundingClientRect().bottom > top);
      if (page) setActivePage(Number(page.dataset.pdfPage));
    });
  };

  useEffect(
    () => () => {
      if (scrollFrame.current !== null)
        cancelAnimationFrame(scrollFrame.current);
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    let task: ReturnType<typeof pdfjs.getDocument> | undefined;
    const fail = () => {
      if (controller.signal.aborted) return;
      setFailed(true);
      controller.abort();
      if (task && !task.destroyed) void task.destroy().catch(() => {});
    };
    const timeout = window.setTimeout(fail, 30_000);

    void (async () => {
      // Some storage origins support byte ranges but don't expose Accept-Ranges
      // to JavaScript. Probe the signed GET directly so PDF.js can seek anyway.
      const probe = await fetch(src, {
        headers: { Range: "bytes=0-" },
        signal: controller.signal,
      });
      const size = Number(probe.headers.get("content-length"));
      await probe.body?.cancel();
      controller.signal.throwIfAborted();

      let source: { url: string } | { range: pdfjs.PDFDataRangeTransport } = {
        url: src,
      };
      if (probe.status === 206 && Number.isSafeInteger(size) && size > 0) {
        const range = new pdfjs.PDFDataRangeTransport(size, null, true);
        range.requestDataRange = (begin, end) => {
          void (async () => {
            const response = await fetch(src, {
              headers: { Range: `bytes=${begin}-${end - 1}` },
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(30_000),
              ]),
            });
            if (response.status !== 206) {
              await response.body?.cancel();
              throw new Error("PDF byte range unavailable");
            }
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (bytes.length !== end - begin)
              throw new Error("Incomplete PDF byte range");
            if (!controller.signal.aborted) range.onDataRange(begin, bytes);
          })().catch(fail);
        };
        source = { range };
      }

      task = pdfjs.getDocument({
        ...source,
        disableAutoFetch: true,
        disableStream: true,
        rangeChunkSize: 512 * 1024,
        cMapUrl: `${assets}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `${assets}/standard_fonts/`,
        wasmUrl: `${assets}/wasm/`,
        iccUrl: `${assets}/iccs/`,
      });
      const pdf = await task.promise;
      const firstPage = await pdf.getPage(1);
      controller.signal.throwIfAborted();
      const viewport = firstPage.getViewport({ scale: 1 });
      setPageRatio(viewport.width / viewport.height);
      setDocument(pdf);
    })()
      .catch(fail)
      .finally(() => window.clearTimeout(timeout));

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
      if (task && !task.destroyed) void task.destroy().catch(() => {});
    };
  }, [src]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const resize = () => {
      const availableWidth = Math.min(900, element.clientWidth - 32);
      const fittedWidth =
        fit === "page"
          ? (element.clientHeight - 48) * pageRatio
          : availableWidth;
      setWidth(Math.max(1, Math.min(availableWidth, fittedWidth)));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [fit, pageRatio]);

  return (
    <Reader>
      <Toolbar>
        <span>{title}</span>
        {document && !native && (
          <PageControls>
            <button
              type="button"
              onClick={() => goToPage(activePage - 1)}
              disabled={activePage <= 1}
              aria-label={t("pdfViewer.previous")}
              title={t("pdfViewer.previous")}
            >
              ‹
            </button>
            <span aria-live="polite">
              {activePage} / {document.numPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage >= document.numPages}
              aria-label={t("pdfViewer.next")}
              title={t("pdfViewer.next")}
            >
              ›
            </button>
            <select
              value={fit}
              onChange={(event) =>
                setFit(event.target.value as "page" | "width")
              }
              aria-label={t("pdfViewer.zoom")}
            >
              <option value="page">{t("pdfViewer.fitPage")}</option>
              <option value="width">{t("pdfViewer.fitWidth")}</option>
            </select>
          </PageControls>
        )}
      </Toolbar>
      {native ? (
        <iframe src={getPdfEmbedUrl(src)} title={title} />
      ) : (
        <ScrollArea
          ref={root}
          aria-label={title}
          tabIndex={0}
          onScroll={handleScroll}
        >
          {failed ? (
            <Status role="alert">
              <p>{t("pdfViewer.loadError")}</p>
              <button type="button" onClick={() => setNative(true)}>
                {t("pdfViewer.openNative")}
              </button>
            </Status>
          ) : document && width ? (
            Array.from({ length: document.numPages }, (_, index) => (
              <PdfPage
                key={index + 1}
                document={document}
                number={index + 1}
                width={width}
                root={root}
                enabled={index === 0 || firstPageReady || activePage > 1}
                onReady={index === 0 ? onFirstPageReady : undefined}
              />
            ))
          ) : (
            <Status>
              <GenericSpinner size={48} isLocal />
            </Status>
          )}
        </ScrollArea>
      )}
    </Reader>
  );
}
