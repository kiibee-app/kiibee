import { Upload } from "tus-js-client";

/** Retry interrupted transfers from the last acknowledged chunk in this session. */
export function uploadVideoWithTus(
  file: File,
  uploadUrl: string,
  signal: AbortSignal,
  onProgress?: (percentage: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => signal.removeEventListener("abort", cancel);
    const upload = new Upload(file, {
      uploadUrl,
      chunkSize: 10 * 1024 * 1024,
      retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
      storeFingerprintForResuming: false,
      onProgress: (uploaded, total) => onProgress?.((uploaded / total) * 100),
      onError: (error) => {
        cleanup();
        reject(error);
      },
      onSuccess: () => {
        cleanup();
        resolve();
      },
    });
    function cancel() {
      cleanup();
      void upload.abort().catch(() => undefined);
      reject(new DOMException("Upload cancelled", "AbortError"));
    }
    if (signal.aborted) return cancel();
    signal.addEventListener("abort", cancel, { once: true });
    upload.start();
  });
}
