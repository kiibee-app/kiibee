import assert from "node:assert/strict";
import { test } from "node:test";
import en from "../locals/en.json";
import da from "../locals/da.json";
import { getCategoryLabel } from "./category";

function translator(dictionary: unknown) {
  return (path: string): string => {
    const value = path
      .split(".")
      .reduce<unknown>(
        (node, key) =>
          node && typeof node === "object"
            ? (node as Record<string, unknown>)[key]
            : undefined,
        dictionary,
      );
    return typeof value === "string" ? value : path;
  };
}
test("category IDs and saved names use the same translations across card types", () => {
  for (const dictionary of [en, da]) {
    const t = translator(dictionary);
    for (const [id, name] of [
      ["arts", "Arts & Illustration"],
      ["books", "Books & Writing"],
      ["wellness", "Wellness & Mindfulness"],
      ["education", "Education / Learning"],
      ["lifestyle", "Lifestyle & Vlogs"],
      ["food", "Cooking / Food"],
      ["fitness", "Sports & Fitness"],
    ]) {
      assert.equal(getCategoryLabel(id, t), getCategoryLabel(name, t));
      assert.notEqual(getCategoryLabel(id, t), id);
    }
  }
});
test("preserves custom category names containing education or learning", () => {
  assert.equal(
    getCategoryLabel("Machine learning", translator(da)),
    "Machine learning",
  );
  assert.equal(
    getCategoryLabel("Education for professionals", translator(en)),
    "Education for professionals",
  );
});
