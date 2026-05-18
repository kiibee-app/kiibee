export function filterUsersByName<T extends { name: string }>(
  items: T[],
  searchValue: string,
): T[] {
  const needle = searchValue.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) => item.name.toLowerCase().includes(needle));
}
