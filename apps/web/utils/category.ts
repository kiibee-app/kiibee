import { toCamelCaseKey } from "./common";
const CATEGORY_ALL = "all";
const CATEGORY_KEYS: Record<string, string> = {
  arts: "artsAndIllustration",
  books: "booksAndWriting",
  wellness: "wellnessAndMindfulness",
  education: "educationAndLearning",
  "education / learning": "educationAndLearning",
  lifestyle: "lifestyleAndVlogs",
  food: "cookingAndFood",
  fitness: "sportsAndFitness",
};

export function getCategoryLabel(
  category: string | null | undefined,
  t: (key: string) => string,
): string {
  if (!category) return "";
  if (category === CATEGORY_ALL) {
    return t("exploreCategories.categories.all");
  }
  const normalized = category.toLowerCase().trim();
  const key = CATEGORY_KEYS[normalized] ?? toCamelCaseKey(category);

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
