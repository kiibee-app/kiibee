import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { uploadVideoWithTus } from "./videoUpload";

test("TUS sends bounded chunks and resumes after an acknowledged chunk loses its response", async () => {
  const total = 21 * 1024 * 1024;
  let offset = 0;
  let heads = 0;
  let interrupt = true;
  const chunks: number[] = [];
  const server = createServer(async (req, res) => {
    res.setHeader("Tus-Resumable", "1.0.0");
    if (req.method === "HEAD") {
      heads++;
      res.setHeader("Upload-Offset", offset);
      res.setHeader("Upload-Length", total);
      res.writeHead(200).end();
      return;
    }
    assert.equal(req.method, "PATCH");
    assert.equal(
      req.headers["content-type"],
      "application/offset+octet-stream",
    );
    assert.equal(Number(req.headers["upload-offset"]), offset);
    let bytes = 0;
    for await (const chunk of req) bytes += chunk.length;
    chunks.push(bytes);
    offset += bytes;
    if (interrupt) {
      interrupt = false;
      res.writeHead(500).end();
      return;
    }
    res.setHeader("Upload-Offset", offset);
    res.writeHead(204).end();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    let progress = 0;
    // tus-js-client accepts Buffers in Node and File objects in the browser.
    await uploadVideoWithTus(
      Buffer.alloc(total) as unknown as File,
      `http://127.0.0.1:${address.port}/upload`,
      new AbortController().signal,
      (value) => {
        progress = value;
      },
    );
    assert.equal(offset, total);
    assert.deepEqual(chunks, [10 * 1024 * 1024, 10 * 1024 * 1024, 1024 * 1024]);
    assert.ok(heads >= 2, "retry must check the server offset");
    assert.equal(progress, 100);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("cancelled uploads do not start network transfers", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    uploadVideoWithTus(
      Buffer.alloc(1) as unknown as File,
      "http://127.0.0.1:1/upload",
      controller.signal,
    ),
    { name: "AbortError" },
  );
});
