import { manualExpiryDate } from 'src/modules/subscription/services/manualExpiryDate';

describe('Danish expiry dates', () => {
  it.each([
    ['2026-11-11', '2026-11-11T23:00:00.000Z'],
    ['2026-07-11', '2026-07-11T22:00:00.000Z'],
    ['2026-03-29', '2026-03-29T22:00:00.000Z'],
    ['2026-10-25', '2026-10-25T23:00:00.000Z'],
  ])('expires after %s in Copenhagen', (date, expected) => {
    expect(manualExpiryDate(date).toISOString()).toBe(expected);
  });
  it.each(['2026-02-30', 'invalid', '2026-11-11T12:00:00Z'])(
    'rejects %s',
    (date) => {
      expect(() => manualExpiryDate(date)).toThrow();
    },
  );
});
