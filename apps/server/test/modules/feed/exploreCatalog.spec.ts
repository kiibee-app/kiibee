import { exploreService } from 'src/modules/feed/services/explore.service';
import { ExploreType } from 'src/modules/feed/dto/exploreQuery.dto';
import {
  getLatestQuery,
  getRecentQuery,
  getTrendingQuery,
  getTopCreatorsQuery,
} from 'src/modules/feed/feed.query';

jest.mock('src/database/db', () => ({ db: {} }));
jest.mock('src/modules/feed/feed.query', () => ({
  getLatestQuery: jest.fn().mockResolvedValue([]),
  getRecentQuery: jest.fn().mockResolvedValue([]),
  getTrendingQuery: jest.fn().mockResolvedValue([]),
  getTopCreatorsQuery: jest.fn().mockResolvedValue([]),
}));

describe('category catalog feed routing', () => {
  beforeEach(() => jest.clearAllMocks());
  it('routes category browsing to all uploads rather than the one-per-creator recent feed', async () => {
    await exploreService(
      100,
      undefined,
      { categoryId: ['music'] },
      ExploreType.CATALOG,
    );
    expect(getLatestQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      undefined,
      undefined,
    );
    expect(getRecentQuery).not.toHaveBeenCalled();
    expect(getTrendingQuery).not.toHaveBeenCalled();
    expect(getTopCreatorsQuery).not.toHaveBeenCalled();
  });
  it('preserves the bounded latest preview feed', async () => {
    await exploreService(12, undefined, {}, ExploreType.LATEST);
    expect(getLatestQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      12,
      undefined,
    );
  });
});
