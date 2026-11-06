import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canOptimizeRemoteImage,
  getImageDeliverySource,
} from "./imageDelivery";

const original =
  "https://kiibee-bucket.lon1.digitaloceanspaces.com/4954/lange_halvvejs_04-2024-some4.jpg";
const derivative = "/media-optimized/lange-halvvejs-04-2024-v1.webp";

test("oversized legacy poster resolves for storage and legacy media URLs", () => {
  assert.equal(getImageDeliverySource(original), derivative);
  assert.equal(
    getImageDeliverySource(original.replace("lon1.", "lon1.cdn.")),
    derivative,
  );
  assert.equal(
    getImageDeliverySource(
      "https://kiibee-bucket.lon1.digitaloceanspaces.com/1696/instachamp_cover_650x1030.jpg",
    ),
    "/media-optimized/uffe-instachamp-v1.webp",
  );
  assert.equal(
    getImageDeliverySource(
      "https://www.kiibee.dk/media/4954/lange_halvvejs_04-2024-some4.jpg",
    ),
    derivative,
  );
});

test("signed URLs, other hosts and ordinary images stay unchanged", () => {
  for (const src of [
    original + "?X-Amz-Signature=private",
    original.replace(
      "kiibee-bucket.lon1.digitaloceanspaces.com",
      "example.com",
    ),
    original.replace("4954", "4955"),
    "/poster.webp",
    "data:image/png;base64,abc",
  ]) {
    assert.equal(getImageDeliverySource(src), src);
  }
  assert.equal(
    canOptimizeRemoteImage(original + "?X-Amz-Signature=private"),
    false,
  );
  assert.equal(canOptimizeRemoteImage(original + "?sig=private"), false);
  assert.equal(canOptimizeRemoteImage(original), true);
});
