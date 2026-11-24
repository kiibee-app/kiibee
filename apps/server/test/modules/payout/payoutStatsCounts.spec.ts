import { db } from 'src/database/db';
import { getPayoutStatsService } from 'src/modules/payout/services/getPayoutStats.service';
jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
function rows(data: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    leftJoin: () => query,
    orderBy: () => query,
    limit: () => query,
    then: (resolve: (value: unknown[]) => unknown) =>
      Promise.resolve(data).then(resolve),
  };
  return query as unknown as ReturnType<typeof db.select>;
}
beforeEach(() => jest.resetAllMocks());
it('shows only unpaid purchases and rentals instead of the creator lifetime totals', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(rows([{ amount: '466.00', currency: 'DKK' }]))
    .mockReturnValueOnce(
      rows([
        { price: '999', itemType: 'purchase' },
        { price: '100', itemType: 'purchase' },
        { price: '200', itemType: 'rental' },
        { price: '166', itemType: 'rental' },
      ]),
    );
  await expect(getPayoutStatsService('creator-a')).resolves.toMatchObject({
    data: { balance: '466.00 kr.', saleCount: 3, purchases: 1, rentals: 2 },
  });
});
it('calculates each creator independently, including the 16-sale example', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(rows([{ amount: '1425.00', currency: 'DKK' }]))
    .mockReturnValueOnce(
      rows([
        ...Array.from({ length: 8 }, () => ({
          price: '90',
          itemType: 'purchase',
        })),
        ...Array.from({ length: 7 }, () => ({
          price: '90',
          itemType: 'rental',
        })),
        { price: '75', itemType: 'rental' },
      ]),
    );
  await expect(getPayoutStatsService('creator-b')).resolves.toMatchObject({
    data: { balance: '1425.00 kr.', saleCount: 16, purchases: 8, rentals: 8 },
  });
});
it('distinguishes an unknown count from zero when imported credits do not match the wallet', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(rows([{ amount: '1425.00', currency: 'DKK' }]))
    .mockReturnValueOnce(rows([{ price: '30', itemType: 'purchase' }]));
  await expect(getPayoutStatsService('creator-c')).resolves.toMatchObject({
    data: {
      balance: '1425.00 kr.',
      saleCount: null,
      purchases: null,
      rentals: null,
      countError: expect.stringContaining('exceeds verified'),
    },
  });
});
it('returns zero counts for an empty wallet', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(rows([{ amount: '0', currency: 'DKK' }]));
  await expect(getPayoutStatsService('creator-d')).resolves.toMatchObject({
    data: { saleCount: 0, purchases: 0, rentals: 0 },
  });
  expect(db.select).toHaveBeenCalledTimes(1);
});
