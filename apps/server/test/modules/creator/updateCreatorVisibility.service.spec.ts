import { updateCreatorVisibilityService } from 'src/modules/creator/services/updateCreatorVisibility.service';

jest.mock('src/database/db', () => ({
  db: {},
}));

jest.mock('src/logger/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

const { db } = jest.requireMock('src/database/db') as {
  db: {
    select: jest.Mock;
    update: jest.Mock;
  };
};

describe('updateCreatorVisibilityService', () => {
  const creatorId = 'creator-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockSelectResult(rows: Array<{ id: string; isHidden: boolean }>) {
    db.select = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(rows),
        }),
      }),
    });
  }

  function mockUpdateResult(row: { id: string; isHidden: boolean }) {
    db.update = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([row]),
        }),
      }),
    });
  }

  it('hides a visible creator', async () => {
    mockSelectResult([{ id: creatorId, isHidden: false }]);
    mockUpdateResult({ id: creatorId, isHidden: true });

    const result = await updateCreatorVisibilityService(creatorId, true);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: creatorId, isHidden: true });
    expect(db.update).toHaveBeenCalled();
  });

  it('returns the current state when already hidden', async () => {
    mockSelectResult([{ id: creatorId, isHidden: true }]);

    const result = await updateCreatorVisibilityService(creatorId, true);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: creatorId, isHidden: true });
    expect(db.update).not.toHaveBeenCalled();
  });

  it('throws when the creator is missing', async () => {
    mockSelectResult([]);

    await expect(
      updateCreatorVisibilityService(creatorId, true),
    ).rejects.toThrow('Creator not found');
  });
});
