import assert from "node:assert/strict";
import { test } from "node:test";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { CACHE_CONFIG } from "./queryCacheConfig";

test("returning to Explore after a minute reuses the loaded result", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const client = new QueryClient({
    defaultOptions: { queries: CACHE_CONFIG.explore },
  });
  let requests = 0;
  const options = {
    queryKey: ["explore", "back-navigation"],
    queryFn: async () => {
      requests++;
      return ["creator"];
    },
  };
  try {
    await client.fetchQuery(options);
    const initial = new QueryObserver(client, options);
    initial.subscribe(() => {})();
    t.mock.timers.tick(60_000);
    const returning = new QueryObserver(client, options);
    const unsubscribe = returning.subscribe(() => {});
    assert.deepEqual(returning.getCurrentResult().data, ["creator"]);
    assert.equal(returning.getCurrentResult().isFetching, false);
    assert.equal(requests, 1);
    unsubscribe();
  } finally {
    client.clear();
  }
});

test("a longer visit keeps Explore visible while stale data refreshes", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const client = new QueryClient({
    defaultOptions: { queries: CACHE_CONFIG.explore },
  });
  const queryKey = ["explore", "long-visit"];
  try {
    await client.fetchQuery({
      queryKey,
      queryFn: async () => ["cached creator"],
    });
    t.mock.timers.tick(6 * 60_000);
    let finish!: (data: string[]) => void;
    const pending = new Promise<string[]>((resolve) => {
      finish = resolve;
    });
    const returning = new QueryObserver(client, {
      queryKey,
      queryFn: () => pending,
    });
    const unsubscribe = returning.subscribe(() => {});
    assert.deepEqual(returning.getCurrentResult().data, ["cached creator"]);
    assert.equal(returning.getCurrentResult().isLoading, false);
    assert.equal(returning.getCurrentResult().isFetching, true);
    finish(["updated creator"]);
    await pending;
    unsubscribe();
  } finally {
    client.clear();
  }
});
