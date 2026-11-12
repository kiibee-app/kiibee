import {
  DEFAULT_DOWNLOAD_LIMIT,
  DEFAULT_STREAM_LIMIT,
  DEFAULT_RENT_DURATION_HOURS,
  DEFAULT_PURCHASE_ACCESS_DAYS,
  resolveDownloadLimit,
} from './downloadLimit';

describe('downloadLimit and access defaults', () => {
  it('has correct default constants matching requirements', () => {
    expect(DEFAULT_DOWNLOAD_LIMIT).toBe(5);
    expect(DEFAULT_STREAM_LIMIT).toBe(7);
    expect(DEFAULT_RENT_DURATION_HOURS).toBe(48);
    expect(DEFAULT_PURCHASE_ACCESS_DAYS).toBe(30);
  });

  it('resolves fallback limit to 5 when no custom limit is set', () => {
    expect(resolveDownloadLimit(null)).toBe(5);
    expect(resolveDownloadLimit(undefined)).toBe(5);
    expect(resolveDownloadLimit(0)).toBe(5);
    expect(resolveDownloadLimit(-1)).toBe(5);
  });

  it('preserves positive custom limits when explicitly provided', () => {
    expect(resolveDownloadLimit(1)).toBe(1);
    expect(resolveDownloadLimit(3)).toBe(3);
    expect(resolveDownloadLimit(10)).toBe(10);
  });
});
