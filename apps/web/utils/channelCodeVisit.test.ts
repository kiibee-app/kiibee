import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  channelCodeVisitKey,
  hasChannelCodeVisit,
  rememberChannelCodeVisit,
  subscribeChannelCodeVisit,
} from "./channelCodeVisit";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let values: Map<string, string>;
let browser: EventTarget & {
  sessionStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
  };
};
beforeEach(() => {
  values = new Map();
  browser = Object.assign(new EventTarget(), {
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: browser,
  });
});
afterEach(() => {
  if (originalWindow)
    Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

test("successful code entry survives a page remount/reload in the same tab", () => {
  const key = channelCodeVisitKey("creator", "viewer");
  assert.equal(hasChannelCodeVisit(key), false);
  rememberChannelCodeVisit("creator", "viewer");
  // A new page/hook reads browser session storage instead of component state.
  assert.equal(
    hasChannelCodeVisit(channelCodeVisitKey("creator", "viewer")),
    true,
  );
});

test("a new tab session asks again instead of using a persistent unlock", () => {
  const key = channelCodeVisitKey("creator", "viewer");
  rememberChannelCodeVisit("creator", "viewer");
  values.clear();
  assert.equal(hasChannelCodeVisit(key), false);
});

test("one creator/user unlock never unlocks another channel or another user", () => {
  rememberChannelCodeVisit("creator-one", "viewer-one");
  assert.equal(
    hasChannelCodeVisit(channelCodeVisitKey("creator-two", "viewer-one")),
    false,
  );
  assert.equal(
    hasChannelCodeVisit(channelCodeVisitKey("creator-one", "viewer-two")),
    false,
  );
  assert.equal(
    hasChannelCodeVisit(channelCodeVisitKey("creator-one", null)),
    false,
  );
  assert.equal(channelCodeVisitKey(null, "viewer-one"), null);
});

test("all gate instances in the same page are notified immediately, and unsubscribe cleans up", () => {
  let notifications = 0;
  const unsubscribe = subscribeChannelCodeVisit(
    channelCodeVisitKey("creator", "viewer"),
    () => {
      notifications++;
    },
  );
  rememberChannelCodeVisit("creator", "viewer");
  assert.equal(notifications, 1);
  unsubscribe();
  rememberChannelCodeVisit("creator", "viewer");
  assert.equal(notifications, 1);
});

test("SSR and unavailable storage fail closed without crashing", () => {
  browser.sessionStorage.getItem = () => {
    throw new Error("Storage disabled");
  };
  browser.sessionStorage.setItem = () => {
    throw new Error("Storage disabled");
  };
  assert.equal(
    hasChannelCodeVisit(channelCodeVisitKey("creator", "viewer")),
    false,
  );
  assert.doesNotThrow(() => rememberChannelCodeVisit("creator", "viewer"));
  Reflect.deleteProperty(globalThis, "window");
  assert.equal(
    hasChannelCodeVisit(channelCodeVisitKey("creator", "viewer")),
    false,
  );
  assert.doesNotThrow(() => rememberChannelCodeVisit("creator", "viewer"));
});
