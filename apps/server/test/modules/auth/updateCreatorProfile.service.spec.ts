import { updateCreatorProfileService } from 'src/modules/auth/services/updateCreatorProfile.service';
import { ensureCreatorChannel } from 'src/modules/auth/services/ensureCreatorChannel.service';
import { creatorOwners } from 'src/database/schema';
import { db } from 'src/database/db';

jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));
jest.mock('src/modules/auth/services/ensureCreatorChannel.service', () => ({
  ensureCreatorChannel: jest.fn().mockResolvedValue(undefined),
}));

describe('creator company and private owner identity', () => {
  let trx: any;
  let values: jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    const responses = [
      [{ firstName: 'Peter Alan', lastName: 'Wheatley' }],
      [{ name: 'FBI.DK' }],
      [{ companyName: 'FBI.DK' }],
    ];
    values = jest.fn().mockReturnValue({
      onConflictDoUpdate: jest.fn().mockResolvedValue(undefined),
    });
    trx = {
      select: jest.fn().mockImplementation(() => ({
        from: () => ({
          where: () => ({
            limit: async () => responses.shift(),
          }),
        }),
      })),
      insert: jest.fn().mockReturnValue({ values }),
      update: jest.fn().mockReturnValue({
        set: jest
          .fn()
          .mockReturnValue({ where: jest.fn().mockResolvedValue(undefined) }),
      }),
    };
    (db.transaction as jest.Mock).mockImplementation((callback) =>
      callback(trx),
    );
  });

  it('keeps company branding when the private owner name changes', async () => {
    await updateCreatorProfileService('creator-fbi', {
      firstName: 'Peter',
      lastName: 'Wheatley',
    });
    expect(ensureCreatorChannel).toHaveBeenCalledWith(trx, {
      creatorId: 'creator-fbi',
      channelName: 'FBI.DK',
    });
    expect(trx.insert).toHaveBeenCalledWith(creatorOwners);
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Peter Wheatley',
        firstName: 'Peter',
        lastName: 'Wheatley',
      }),
    );
  });

  it('uses a company edit for the channel without changing owner names', async () => {
    await updateCreatorProfileService('creator-fbi', {
      companyName: ' FBI Productions ',
    });
    expect(ensureCreatorChannel).toHaveBeenCalledWith(trx, {
      creatorId: 'creator-fbi',
      channelName: 'FBI Productions',
    });
    expect(trx.insert).not.toHaveBeenCalledWith(creatorOwners);
  });
});
