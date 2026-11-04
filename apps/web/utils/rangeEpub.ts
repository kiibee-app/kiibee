import ePub, { type Book } from "epubjs";
import {
  Reader,
  ZipReader,
  TextWriter,
  BlobWriter,
  type FileEntry,
} from "@zip.js/zip.js";

const BLOCK_SIZE = 512 * 1024;
const ZIP_TAIL_SIZE = 65_557;

/** Read only ZIP blocks requested by the current chapter, with bounded caching. */
class EpubRangeReader extends Reader<string> {
  private blocks = new Map<number, Promise<Uint8Array>>();
  private active = 0;
  private waiting: Array<() => void> = [];
  constructor(
    private url: string,
    size: number,
    private signal: AbortSignal,
  ) {
    super(url);
    this.size = size;
  }
  private async block(index: number): Promise<Uint8Array> {
    const cached = this.blocks.get(index);
    if (cached) return cached;
    const pending = (async () => {
      if (this.active >= 4)
        await new Promise<void>((resolve) => this.waiting.push(resolve));
      else this.active++;
      try {
        this.signal.throwIfAborted();
        const start = index * BLOCK_SIZE;
        const end = Math.min(this.size - 1, start + BLOCK_SIZE - 1);
        const response = await fetch(this.url, {
          signal: AbortSignal.any([this.signal, AbortSignal.timeout(30_000)]),
          headers: { Range: `bytes=${start}-${end}` },
        });
        if (response.status !== 206) {
          await response.body?.cancel();
          throw new Error("EPUB storage must support byte ranges");
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length !== end - start + 1)
          throw new Error("Incomplete EPUB range");
        return bytes;
      } finally {
        const next = this.waiting.shift();
        if (next) next();
        else this.active--;
      }
    })();
    this.blocks.set(index, pending);
    pending.catch(() => this.blocks.delete(index));
    // At most 32 MB of compressed ZIP data remains in the reader cache.
    if (this.blocks.size > 64)
      this.blocks.delete(this.blocks.keys().next().value!);
    return pending;
  }
  async readUint8Array(offset: number, length: number): Promise<Uint8Array> {
    if (
      !Number.isSafeInteger(offset) ||
      !Number.isSafeInteger(length) ||
      offset < 0 ||
      length < 0 ||
      offset > this.size
    ) {
      throw new Error("Invalid EPUB byte range");
    }
    if (length === 0 || offset === this.size) return new Uint8Array();
    const end = Math.min(this.size, offset + length);
    const first = Math.floor(offset / BLOCK_SIZE);
    const last = Math.floor((end - 1) / BLOCK_SIZE);
    const blocks = await Promise.all(
      Array.from({ length: last - first + 1 }, (_, i) => this.block(first + i)),
    );
    const result = new Uint8Array(end - offset);
    for (let index = first; index <= last; index++) {
      const start = Math.max(offset, index * BLOCK_SIZE);
      const stop = Math.min(end, (index + 1) * BLOCK_SIZE);
      result.set(
        blocks[index - first].subarray(
          start - index * BLOCK_SIZE,
          stop - index * BLOCK_SIZE,
        ),
        start - offset,
      );
    }
    return result;
  }
}

export async function openRangeEpub(
  src: string,
  signal: AbortSignal,
  onProgress?: (phase: "index" | "prepare") => void,
): Promise<{ book: Book; dispose: () => void }> {
  const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(30_000)]);
  const probe = await fetch(src, {
    signal: requestSignal,
    headers: { Range: `bytes=-${ZIP_TAIL_SIZE}` },
  });
  const contentRange = probe.headers.get("content-range");
  let size = Number(contentRange?.split("/").at(-1));
  let tail: Uint8Array | undefined;
  if (probe.status === 206 && Number.isSafeInteger(size) && size > 0) {
    tail = new Uint8Array(await probe.arrayBuffer());
    if (tail.length !== Math.min(size, ZIP_TAIL_SIZE))
      throw new Error("Incomplete EPUB range");
  } else {
    await probe.body?.cancel();
    // Some storage origins allow Range but expose only Content-Length.
    const lengthProbe = await fetch(src, {
      signal: requestSignal,
      headers: { Range: "bytes=0-" },
    });
    size = Number(lengthProbe.headers.get("content-length"));
    await lengthProbe.body?.cancel();
    if (lengthProbe.status !== 206 || !Number.isSafeInteger(size) || size <= 0)
      throw new Error(
        "EPUB storage must expose its length and support byte ranges",
      );
  }
  const source = new EpubRangeReader(src, size, signal);
  onProgress?.("index");
  // Verify the original end record before restricting concatenated legacy EPUBs
  // to the first archive, so ZIP parsing doesn't probe every chapter.
  tail ??= await source.readUint8Array(
    Math.max(0, size - ZIP_TAIL_SIZE),
    Math.min(size, ZIP_TAIL_SIZE),
  );
  const tailView = new DataView(tail.buffer, tail.byteOffset, tail.byteLength);
  for (let index = tail.length - 22; index >= 0; index--) {
    if (tailView.getUint32(index, true) !== 0x06054b50) continue;
    const commentLength = tailView.getUint16(index + 20, true);
    if (index + 22 + commentLength !== tail.length) continue;
    const directorySize = tailView.getUint32(index + 12, true);
    const directoryOffset = tailView.getUint32(index + 16, true);
    const originalSize = directoryOffset + directorySize + 22 + commentLength;
    if (originalSize > 22 && originalSize < size && directoryOffset > 0) {
      const [record, first, directory] = await Promise.all([
        source.readUint8Array(originalSize - 22 - commentLength, 22),
        source.readUint8Array(0, 4),
        source.readUint8Array(directoryOffset, 4),
      ]);
      if (
        record.every((byte, i) => byte === tail[index + i]) &&
        new DataView(first.buffer).getUint32(0, true) === 0x04034b50 &&
        new DataView(directory.buffer).getUint32(0, true) === 0x02014b50
      ) {
        source.size = originalSize;
      }
    }
    break;
  }
  const archive = new ZipReader(source, { useWebWorkers: false });
  let book: Book | undefined;
  let disposed = false;
  const blobUrls = new Set<string>();
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    book?.destroy();
    for (const url of blobUrls) URL.revokeObjectURL(url);
    void archive.close();
  };
  try {
    onProgress?.("index");
    const entries = (await archive.getEntries()).filter(
      (entry): entry is FileEntry => !entry.directory,
    );
    const files = new Map(
      entries.map((entry) => [entry.filename.replace(/^\/+/, ""), entry]),
    );
    const base = `${window.location.origin}/__epub_archive__/${crypto.randomUUID()}/`;
    const pathOf = (value: string, relativeTo = base) => {
      const url = new URL(value, relativeTo);
      if (!url.href.startsWith(base)) return null;
      return decodeURIComponent(
        url.pathname.slice(new URL(base).pathname.length),
      );
    };
    const textCache = new Map<string, Promise<string>>();
    const textOf = (path: string) => {
      let result = textCache.get(path);
      if (!result) {
        const entry = files.get(path);
        if (!entry)
          return Promise.reject(new Error(`EPUB entry not found: ${path}`));
        result = entry.getData(new TextWriter(), { signal });
        textCache.set(path, result);
      }
      return result;
    };
    const parseXml = (value: string) =>
      new DOMParser().parseFromString(value, "application/xml");
    const container = parseXml(await textOf("META-INF/container.xml"));
    const packagePath = container
      .querySelector("rootfile")
      ?.getAttribute("full-path");
    if (!packagePath || !files.has(packagePath))
      throw new Error("Invalid EPUB package");
    const packageUrl = new URL(packagePath, base).href;
    const packageXml = parseXml(await textOf(packagePath));
    const mediaTypes = new Map<string, string>();
    for (const item of packageXml.querySelectorAll("manifest > item")) {
      const path = pathOf(item.getAttribute("href") || "", packageUrl);
      if (path)
        mediaTypes.set(
          path,
          item.getAttribute("media-type") || "application/octet-stream",
        );
    }
    const assetCache = new Map<string, Promise<string>>();
    const rewriteCss = async (
      css: string,
      cssUrl: string,
      stack: Set<string>,
    ): Promise<string> => {
      const matches = [
        ...css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)|@import\s+(['"])(.*?)\3/g),
      ];
      const replacements = await Promise.all(
        matches.map(async (match) => {
          const value = match[2] ?? match[4];
          if (!value || value.startsWith("#") || value.startsWith("data:"))
            return match[0];
          const path = pathOf(value, cssUrl);
          if (!path || !files.has(path) || stack.has(path)) return match[0];
          const replacement = await assetUrl(path, stack);
          return match[2] !== undefined
            ? `url("${replacement}")`
            : `@import "${replacement}"`;
        }),
      );
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        css =
          css.slice(0, match.index!) +
          replacements[i] +
          css.slice(match.index! + match[0].length);
      }
      return css;
    };
    const assetUrl = (
      path: string,
      stack = new Set<string>(),
    ): Promise<string> => {
      const cached = assetCache.get(path);
      if (cached) return cached;
      const entry = files.get(path);
      if (!entry)
        return Promise.reject(new Error(`EPUB asset not found: ${path}`));
      const pending = (async () => {
        const mime = mediaTypes.get(path) || "application/octet-stream";
        const blob =
          mime === "text/css" || path.endsWith(".css")
            ? new Blob(
                [
                  await rewriteCss(
                    await textOf(path),
                    new URL(path, base).href,
                    new Set([...stack, path]),
                  ),
                ],
                { type: "text/css" },
              )
            : await entry.getData(new BlobWriter(mime), { signal });
        signal.throwIfAborted();
        const url = URL.createObjectURL(blob);
        blobUrls.add(url);
        return url;
      })();
      assetCache.set(path, pending);
      return pending;
    };
    book = ePub({
      replacements: "none",
      requestMethod: async (url, type) => {
        signal.throwIfAborted();
        const path = pathOf(url);
        if (!path) throw new Error("Invalid EPUB chapter path");
        const value = await textOf(path);
        if (type === "json") return JSON.parse(value);
        return parseXml(value);
      },
    });
    // Resolve only resources referenced by the chapter being displayed. EPUB.js
    // otherwise extracts every image in the entire archive before first display.
    book.spine.hooks.serialize.register(
      async (output: string, section: { url: string; output: string }) => {
        const doc = parseXml(output);
        const chapterUrl = new URL(section.url, base).href;
        const work: Promise<unknown>[] = [];
        for (const element of doc.querySelectorAll(
          "img, image, link, source, video, audio, object",
        )) {
          for (const attribute of [
            "src",
            "href",
            "xlink:href",
            "poster",
            "data",
          ]) {
            const value = element.getAttribute(attribute);
            if (!value) continue;
            const path = pathOf(value, chapterUrl);
            if (path && files.has(path))
              work.push(
                assetUrl(path).then((url) =>
                  element.setAttribute(attribute, url),
                ),
              );
          }
          const srcset = element.getAttribute("srcset");
          if (srcset && !srcset.startsWith("data:"))
            work.push(
              Promise.all(
                srcset.split(",").map(async (candidate) => {
                  const [url, ...descriptors] = candidate.trim().split(/\s+/);
                  const path = pathOf(url, chapterUrl);
                  return [
                    path && files.has(path) ? await assetUrl(path) : url,
                    ...descriptors,
                  ].join(" ");
                }),
              ).then((values) =>
                element.setAttribute("srcset", values.join(", ")),
              ),
            );
        }
        for (const element of doc.querySelectorAll("style, [style]")) {
          if (element.localName === "style")
            work.push(
              rewriteCss(element.textContent || "", chapterUrl, new Set()).then(
                (css) => {
                  element.textContent = css;
                },
              ),
            );
          const style = element.getAttribute("style");
          if (style)
            work.push(
              rewriteCss(style, chapterUrl, new Set()).then((css) =>
                element.setAttribute("style", css),
              ),
            );
        }
        await Promise.all(work);
        signal.throwIfAborted();
        section.output = new XMLSerializer().serializeToString(doc);
      },
    );
    onProgress?.("prepare");
    await book.open(packageUrl, "opf");
    signal.throwIfAborted();
    return { book, dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
