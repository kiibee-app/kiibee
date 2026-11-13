/** Direct storage upload with byte progress and an inactivity timeout. */
export function uploadFileWithProgress(
  url: string,
  file: File,
  contentType: string | undefined,
  signal: AbortSignal,
  onProgress: (percentage: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    let timer: ReturnType<typeof setTimeout>;
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
      if (error) reject(error);
      else resolve();
    };
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        finish(
          new Error("Upload stalled. Check your connection and try again."),
        );
        request.abort();
      }, 120_000);
    };
    const cancel = () => {
      finish(new DOMException("Upload cancelled", "AbortError"));
      request.abort();
    };
    if (signal.aborted) return cancel();
    request.open("PUT", url);
    if (contentType) request.setRequestHeader("Content-Type", contentType);
    request.upload.onprogress = (event) => {
      resetTimer();
      // Reserve completion for the storage response and API confirmation.
      if (event.lengthComputable)
        onProgress(Math.min(99, (event.loaded / event.total) * 100));
    };
    request.upload.onload = resetTimer;
    request.onprogress = resetTimer;
    request.onload = () =>
      finish(
        request.status >= 200 && request.status < 300
          ? undefined
          : new Error(
              `Upload failed (HTTP ${request.status}). Please try again.`,
            ),
      );
    request.onerror = () =>
      finish(
        new Error(
          "Upload connection failed. Check your connection and try again.",
        ),
      );
    request.onabort = () =>
      finish(new DOMException("Upload cancelled", "AbortError"));
    signal.addEventListener("abort", cancel, { once: true });
    resetTimer();
    try {
      request.send(file);
    } catch (error) {
      finish(error instanceof Error ? error : new Error("Upload failed"));
    }
  });
}
