import { updateCreatorSequenceService } from 'src/modules/creator/services/updateCreatorSequence.service';

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

describe('updateCreatorSequenceService', () => {
  const creatorId = 'creator-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockCreatorAndDuplicate(
    creatorRows: any[],
    duplicateRows: any[] = [],
  ) {
    let callCount = 0;
    db.select = jest.fn().mockImplementation(() => {
      callCount++;
      const currentCall = callCount;
      return {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockImplementation(() => {
              if (currentCall === 1) return Promise.resolve(creatorRows);
              return Promise.resolve(duplicateRows);
            }),
          }),
        }),
      };
    });
  }

  function mockUpdateSuccess(updatedRow: any) {
    db.update = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([updatedRow]),
        }),
      }),
    });
  }

  function mockUpdateError(error: any) {
    db.update = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(error),
        }),
      }),
    });
  }

  it('updates creator sequence successfully', async () => {
    mockCreatorAndDuplicate([{ id: creatorId, sequence: null }], []);
    mockUpdateSuccess({ id: creatorId, sequence: 5 });

    const result = await updateCreatorSequenceService(creatorId, 5);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: creatorId, sequence: 5 });
  });

  it('removes creator sequence when null is passed', async () => {
    mockCreatorAndDuplicate([{ id: creatorId, sequence: 5 }], []);
    mockUpdateSuccess({ id: creatorId, sequence: null });

    const result = await updateCreatorSequenceService(creatorId, null);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: creatorId, sequence: null });
  });

  it('returns 400 when sequence is already assigned (detected by SELECT)', async () => {
    mockCreatorAndDuplicate(
      [{ id: creatorId, sequence: null }],
      [{ id: 'creator-2', fullName: 'John Doe', email: 'john@example.com' }],
    );

    await expect(updateCreatorSequenceService(creatorId, 5)).rejects.toThrow(
      'Sequence #5 is already assigned to "John Doe"',
    );
  });

  it('catches Postgres 23505 unique violation and returns 400 on concurrent update', async () => {
    mockCreatorAndDuplicate([{ id: creatorId, sequence: null }], []);
    mockUpdateError({
      code: '23505',
      message: 'duplicate key value violates unique constraint',
    });

    await expect(updateCreatorSequenceService(creatorId, 5)).rejects.toThrow(
      'Sequence #5 is already assigned',
    );
  });

  it('returns 404 when creator is not found', async () => {
    mockCreatorAndDuplicate([], []);

    await expect(updateCreatorSequenceService(creatorId, 5)).rejects.toThrow(
      'Creator not found',
    );
  });
});
