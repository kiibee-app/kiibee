type CategoryContent = { id: string; creatorId?: string | null };

// Prefer distinct creators, then fill unused slots with their other uploads.
export function balanceCategoryContent<T extends CategoryContent>(
  items: T[],
  limit: number,
): T[] {
  const ids = new Set<string>();
  const creators = new Set<string>();
  const first: T[] = [];
  const remaining: T[] = [];
  for (const item of items) {
    if (ids.has(item.id)) continue;
    ids.add(item.id);
    const creator = item.creatorId?.trim();
    if (!creator || !creators.has(creator)) {
      if (creator) creators.add(creator);
      first.push(item);
    } else remaining.push(item);
  }
  return [...first, ...remaining].slice(0, limit);
}
