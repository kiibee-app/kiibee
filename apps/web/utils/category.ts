import { toCamelCaseKey } from "./common";
import { CATEGORY_ALL } from "./Constants";

export function getCategoryLabel(
  category: string | null | undefined,
  t: (key: string) => string,
): string {
  if (!category) return "";
  if (category === CATEGORY_ALL) {
    return t("exploreCategories.categories.all");
  }
  const key = toCamelCaseKey(category);

  const paths = [
    `viewerSignup.preference.content.options.${key}`,
    `exploreCategories.categories.${key}`,
    `creators.filters.options.categories.${key}`,
  ];

  for (const path of paths) {
    const translation = t(path);
    if (translation && translation !== path) {
      return translation;
    }
  }
  return category;
}
