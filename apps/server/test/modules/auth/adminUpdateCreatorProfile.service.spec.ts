import { HttpStatus } from '@nestjs/common';
import { adminUpdateCreatorProfileService } from 'src/modules/auth/services/adminUpdateCreatorProfile.service';
import * as getCreatorByIdModule from 'src/modules/auth/services/getCreatorById.service';
import * as ensureCreatorChannelModule from 'src/modules/auth/services/ensureCreatorChannel.service';
import { db } from 'src/database/db';

jest.mock('src/database/db', () => ({
  db: {
    execute: jest.fn().mockResolvedValue(undefined),
    select: jest.fn(),
    transaction: jest.fn(),
  },
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock-random-uuid'),
}));

describe('adminUpdateCreatorProfileService', () => {
  const creatorId = 'creator-uuid-1';
  const mockDb = db as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return NOT_FOUND if creator is not found', async () => {
    mockDb.execute.mockResolvedValue(undefined);
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(
      adminUpdateCreatorProfileService(creatorId, {
        ownerName: 'Test Owner',
      }),
    ).rejects.toThrow('Creator not found');
  });

  it('should successfully update owner name and creator info', async () => {
    mockDb.execute.mockResolvedValue(undefined);

    // Mock existing user
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            {
              id: creatorId,
              email: 'creator@example.com',
              role: 'creator',
              fullName: 'Old Name',
            },
          ]),
        }),
      }),
    });

    const trxInsertValues = jest.fn().mockReturnValue({
      onConflictDoUpdate: jest.fn().mockResolvedValue(undefined),
    });
    const trxUpdateSet = jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    });

    const mockTrx = {
      select: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
      insert: jest.fn().mockReturnValue({
        values: trxInsertValues,
      }),
      update: jest.fn().mockReturnValue({
        set: trxUpdateSet,
      }),
    };

    mockDb.transaction.mockImplementation(async (callback: any) => {
      return callback(mockTrx);
    });

    jest
      .spyOn(ensureCreatorChannelModule, 'ensureCreatorChannel')
      .mockResolvedValue(undefined);

    const mockProfileResponse = {
      status: true,
      message: 'Creator found',
      data: {
        id: creatorId,
        ownerName: 'Jakob Hansen',
        email: 'ida@fysioteamet.dk',
        companyName: 'Funktionel Neuroterapeut 2026',
      },
    };

    jest
      .spyOn(getCreatorByIdModule, 'getCreatorByIdService')
      .mockResolvedValue(mockProfileResponse as any);

    const result = await adminUpdateCreatorProfileService(creatorId, {
      ownerName: 'Jakob Hansen',
      companyName: 'Funktionel Neuroterapeut 2026',
      channelName: 'Funktionel Neuroterapeut 2026',
      email: 'ida@fysioteamet.dk',
      city: 'Birkerød',
      address: 'Byagervej 135',
      postalCode: '3460',
      cvr: '39591419',
      phone: '28834468',
    });

    expect(mockDb.execute).toHaveBeenCalled();
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(trxInsertValues).toHaveBeenCalled();
    expect(trxUpdateSet).toHaveBeenCalled();
    expect(
      ensureCreatorChannelModule.ensureCreatorChannel,
    ).toHaveBeenCalledWith(mockTrx, {
      creatorId,
      channelName: 'Funktionel Neuroterapeut 2026',
    });
    expect(result).toEqual(mockProfileResponse);
  });
});
