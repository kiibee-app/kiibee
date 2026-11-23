import assert from "node:assert/strict";
import { test } from "node:test";
import { QueryClient } from "@tanstack/react-query";
import { getCloseCreatorMutationOptions } from "./use-close-creator";
import { QUERY_KEY } from "../../utils/constants";

test("closure requires explicit confirmation from the server", async () => {
  const client = new QueryClient();
  const mutation = getCloseCreatorMutationOptions(client);
  const original = globalThis.fetch;
  let response: unknown = { success: true, data: null };
  globalThis.fetch = async () => new Response(JSON.stringify(response));
  try {
    await assert.rejects(mutation.mutationFn("creator"), /did not confirm/);
    response = { success: false, message: "Billing cancellation failed" };
    await assert.rejects(
      mutation.mutationFn("creator"),
      /Billing cancellation failed/,
    );
    response = { success: true, data: { id: "other", isDeleted: true } };
    await assert.rejects(mutation.mutationFn("creator"), /did not confirm/);
    response = { success: true, data: { id: "creator", isDeleted: true } };
    await assert.doesNotReject(mutation.mutationFn("creator"));
  } finally {
    globalThis.fetch = original;
    client.clear();
  }
});

test("successful closure removes every cached creator page and refreshes history", async () => {
  const client = new QueryClient();
  for (const filter of [
    { page: 1 },
    { page: 2 },
    { hidden: true },
    { plan: "Pro" },
  ]) {
    client.setQueryData([QUERY_KEY.EXISTING_CREATORS, filter], {
      items: [{ id: "creator" }],
    });
  }
  client.setQueryData([QUERY_KEY.CREATOR_DETAIL, "creator"], { id: "creator" });
  client.setQueryData([QUERY_KEY.CREATOR_DELETION_HISTORY], []);
  client.setQueryData([QUERY_KEY.CREATOR_DELETION_REQUESTS], []);
  await getCloseCreatorMutationOptions(client).onSuccess(null, "creator");
  assert.equal(
    client.getQueriesData({ queryKey: [QUERY_KEY.EXISTING_CREATORS] }).length,
    0,
  );
  assert.equal(
    client.getQueryData([QUERY_KEY.CREATOR_DETAIL, "creator"]),
    undefined,
  );
  assert.equal(
    client.getQueryState([QUERY_KEY.CREATOR_DELETION_HISTORY])?.isInvalidated,
    true,
  );
  assert.equal(
    client.getQueryState([QUERY_KEY.CREATOR_DELETION_REQUESTS])?.isInvalidated,
    true,
  );
  client.clear();
});
