import { ensureCreatorChannel } from 'src/modules/auth/services/ensureCreatorChannel.service';

jest.mock('src/database/db', () => ({
  db: {},
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('channel-id-1'),
}));

describe('ensureCreatorChannel', () => {
  const creatorId = 'creator-1';

  function createClient(overrides?: {
    existing?: { id: string; name: string; isPublished?: boolean } | null;
  }) {
    const existing = overrides?.existing ?? null;
    let selectCall = 0;
    const updateSet = jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    });
    const insertValues = jest.fn().mockResolvedValue(undefined);

    const client = {
      select: jest.fn().mockImplementation(() => {
        selectCall += 1;
        const callIndex = selectCall;
        return {
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockImplementation(async () => {
                if (callIndex === 1) {
                  return existing
                    ? [
                        {
                          isPublished: true,
                          ...existing,
                        },
                      ]
                    : [];
                }
                // Slug uniqueness checks — no conflicts in these tests
                return [];
              }),
            }),
          }),
        };
      }),
      update: jest.fn().mockReturnValue({ set: updateSet }),
      insert: jest.fn().mockReturnValue({ values: insertValues }),
      _updateSet: updateSet,
      _insertValues: insertValues,
    };

    return client;
  }

  it('creates a published channel named after the creator when missing', async () => {
    const client = createClient();

    await ensureCreatorChannel(client as any, {
      creatorId,
      channelName: 'Thomas Hartmann',
    });

    expect(client.insert).toHaveBeenCalled();
    expect(client._insertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'channel-id-1',
        creatorId,
        name: 'Thomas Hartmann',
        slug: 'thomas-hartmann',
        isPublished: true,
      }),
    );
  });

  it('updates channel name to match creator when channel already exists', async () => {
    const client = createClient({
      existing: { id: 'ch-1', name: 'Forlaget AKKA', isPublished: true },
    });

    await ensureCreatorChannel(client as any, {
      creatorId,
      channelName: 'Thomas Wivel',
    });

    expect(client.insert).not.toHaveBeenCalled();
    expect(client._updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Thomas Wivel' }),
    );
  });

  it('publishes an existing draft channel', async () => {
    const client = createClient({
      existing: { id: 'ch-1', name: 'Tanjuma Afroz', isPublished: false },
    });

    await ensureCreatorChannel(client as any, {
      creatorId,
      channelName: 'Tanjuma Afroz',
    });

    expect(client.insert).not.toHaveBeenCalled();
    expect(client._updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ isPublished: true }),
    );
  });

  it('skips update when channel name already matches and is published', async () => {
    const client = createClient({
      existing: { id: 'ch-1', name: 'Red Barnet', isPublished: true },
    });

    await ensureCreatorChannel(client as any, {
      creatorId,
      channelName: 'Red Barnet',
    });

    expect(client.insert).not.toHaveBeenCalled();
    expect(client.update).not.toHaveBeenCalled();
  });
});
