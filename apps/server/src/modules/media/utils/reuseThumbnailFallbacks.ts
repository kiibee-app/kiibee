export type ImageReference = {
  table: string;
  column: string;
  id: string;
  oldUrl: string;
};
type Candidate = {
  source: string;
  status: 'ready' | 'failed';
  references: ImageReference[];
};

/** Match the public sibling thumbnail already preferred by the web client's durable-first fallback. */
export function reuseThumbnailFallbacks(entries: Candidate[]): number {
  const publicByContent = new Map<string, Candidate>();
  for (const entry of entries) {
    if (entry.status !== 'ready') continue;
    for (const ref of entry.references) {
      if (ref.table === 'media_files') publicByContent.set(ref.id, entry);
    }
  }
  const recovered = new Set<string>();
  for (const entry of entries) {
    if (
      entry.status !== 'failed' ||
      !/^https:\/\/(?:[^/]+\.)?(?:videodelivery\.net|cloudflarestream\.com)\//.test(
        entry.source,
      )
    )
      continue;
    for (const ref of entry.references) {
      if (ref.table !== 'media_files') continue;
      const sibling = publicByContent.get(ref.id);
      if (!sibling) continue;
      const identity = `${ref.table}:${ref.id}:${ref.column}`;
      if (
        !sibling.references.some(
          (r) =>
            r.table === ref.table && r.id === ref.id && r.column === ref.column,
        )
      )
        sibling.references.push({ ...ref });
      recovered.add(identity);
    }
  }
  return recovered.size;
}
