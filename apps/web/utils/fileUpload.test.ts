import assert from "node:assert/strict";
import { test } from "node:test";
import { uploadFileWithProgress } from "./fileUpload";

class StorageRequest {
  static latest: StorageRequest;
  upload = {
    onprogress: null as
      | null
      | ((event: {
          loaded: number;
          total: number;
          lengthComputable: boolean;
        }) => void),
    onload: null as null | (() => void),
  };
  onprogress?: () => void;
  onload?: () => void;
  onerror?: () => void;
  onabort?: () => void;
  status = 200;
  aborted = false;
  method?: string;
  constructor() {
    StorageRequest.latest = this;
  }
  open(method: string) {
    this.method = method;
  }
  setRequestHeader() {}
  send() {}
  abort() {
    this.aborted = true;
    this.onabort?.();
  }
}

test("direct upload handles large-file progress, failure, cancellation and inactivity", async (t) => {
  const original = Object.getOwnPropertyDescriptor(
    globalThis,
    "XMLHttpRequest",
  );
  Object.defineProperty(globalThis, "XMLHttpRequest", {
    configurable: true,
    value: StorageRequest,
  });
  t.mock.timers.enable({ apis: ["setTimeout"] });
  try {
    let progress = 0;
    const start = (signal = new AbortController().signal) =>
      uploadFileWithProgress(
        "https://storage.example/file",
        {} as File,
        "audio/wav",
        signal,
        (value) => {
          progress = value;
        },
      );
    const success = start();
    const req = StorageRequest.latest;
    assert.equal(req.method, "PUT");
    req.upload.onprogress?.({
      loaded: 1_000_000_000,
      total: 2_000_000_000,
      lengthComputable: true,
    });
    assert.equal(progress, 50);
    t.mock.timers.tick(119_000);
    req.upload.onprogress?.({
      loaded: 2_000_000_000,
      total: 2_000_000_000,
      lengthComputable: true,
    });
    assert.equal(progress, 99);
    t.mock.timers.tick(119_000);
    assert.equal(
      req.aborted,
      false,
      "active uploads may last over two minutes",
    );
    req.onload?.();
    await success;

    const failed = start();
    StorageRequest.latest.status = 403;
    StorageRequest.latest.onload?.();
    await assert.rejects(failed, /HTTP 403/);

    const controller = new AbortController();
    const cancelled = start(controller.signal);
    controller.abort();
    await assert.rejects(cancelled, { name: "AbortError" });
    assert.equal(StorageRequest.latest.aborted, true);

    const stalled = start();
    const rejected = assert.rejects(stalled, /Upload stalled/);
    t.mock.timers.tick(120_000);
    await rejected;
    assert.equal(StorageRequest.latest.aborted, true);
  } finally {
    t.mock.timers.reset();
    if (original) Object.defineProperty(globalThis, "XMLHttpRequest", original);
    else Reflect.deleteProperty(globalThis, "XMLHttpRequest");
  }
});
