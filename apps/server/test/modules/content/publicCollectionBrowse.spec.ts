import { db } from 'src/database/db';
import { getProfilePaymentState } from 'src/utils/profilePayment';
import { getPublicCollectionService } from 'src/modules/content/services/getPublicCollection.service';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
jest.mock('src/utils/profilePayment', () => ({
  getProfilePaymentState: jest.fn(),
  isProfilePass: jest.fn(() => false),
}));
jest.mock('src/utils/publicCreatorVisibility', () => ({
  requirePubliclyVisibleCreator: jest.fn().mockResolvedValue({ id: 'creator' }),
  publiclyVisibleCreatorWhere: undefined,
}));

function result(rows: unknown[]) {
  const q = Object.assign(Promise.resolve(rows), {
    from: jest.fn(() => q),
    limit: jest.fn(() => q),
    innerJoin: jest.fn(() => q),
    leftJoin: jest.fn(() => q),
    where: jest.fn(() => q),
    orderBy: jest.fn(() => q),
  });
  jest.mocked(db.select).mockReturnValueOnce(q as never);
}

describe('public collection browsing on paid channels', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([false, true])(
    'shows cards while protecting media (access: %s)',
    async (hasAccess) => {
      jest.mocked(getProfilePaymentState).mockResolvedValue({
        required: true,
        hasAccess,
      } as never);
      result([{ id: 'collection', creatorId: 'creator', name: 'Collection' }]);
      result([
        {
          id: 'content',
          title: 'Visible card',
          thumbnailUrl: 'cover.jpg',
          contentUrl: 'protected.mp4',
          createdAt: new Date(),
        },
      ]);
      result([{ id: 'creator', name: 'Creator' }]);

      const response = await getPublicCollectionService('collection');
      expect(response.data).toEqual(
        expect.objectContaining({
          items: [
            expect.objectContaining({
              id: 'content',
              title: 'Visible card',
              thumbnailUrl: 'cover.jpg',
              contentUrl: hasAccess ? 'protected.mp4' : null,
            }),
          ],
        }),
      );
    },
  );
});
