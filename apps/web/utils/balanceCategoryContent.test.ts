import assert from "node:assert/strict";
import { test } from "node:test";
import { balanceCategoryContent } from "./balanceCategoryContent";

const songs = (creator: string, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${creator}-${index}`,
    creatorId: creator,
  }));

test("fills 12 Music cards even when there are only three musicians", () => {
  const music = [...songs("a", 10), ...songs("b", 4), ...songs("c", 3)];
  const cards = balanceCategoryContent(music, 12);
  assert.equal(cards.length, 12);
  assert.deepEqual(
    cards.slice(0, 3).map((item) => item.creatorId),
    ["a", "b", "c"],
  );
  assert.equal(new Set(cards.map((item) => item.id)).size, 12);
});

test("keeps one upload per creator when there are at least 12 creators", () => {
  const items = Array.from({ length: 14 }, (_, index) =>
    songs(String(index), 3),
  ).flat();
  const cards = balanceCategoryContent(items, 12);
  assert.equal(new Set(cards.map((item) => item.creatorId)).size, 12);
});

test("returns all available matching content when fewer than 12 exist", () => {
  const items = [...songs("a", 3), ...songs("b", 2)];
  assert.equal(balanceCategoryContent(items, 12).length, 5);
});

test("never duplicates a card to fill a category", () => {
  const items = songs("a", 3);
  assert.equal(balanceCategoryContent([...items, ...items], 12).length, 3);
});

test("balances only the selected category and can fill it beyond the old feed cap", () => {
  const items = Array.from({ length: 130 }, (_, index) => ({
    ...songs("other", 1)[0],
    id: `other-${index}`,
    category: "other",
  }));
  const music = songs("musician", 15).map((item) => ({
    ...item,
    category: "music",
  }));
  const cards = balanceCategoryContent(
    [...items, ...music].filter((item) => item.category === "music"),
    12,
  );
  assert.equal(cards.length, 12);
  assert.ok(cards.every((item) => item.category === "music"));
});
