import { setupCreatorAccountService } from 'src/modules/auth/services/creatorAccountSetup.service';
import { db } from 'src/database/db';
import { hashPassword } from 'src/utils/passwordHash';
import { ACCOUNT_STATUS } from 'src/utils/constant';

jest.mock('src/database/db', () => ({
  db: {
    transaction: jest.fn(),
  },
}));

jest.mock('src/utils/passwordHash');
const crypto = require('crypto');

const originalRandomUUID = crypto.randomUUID;
crypto.randomUUID = jest.fn().mockReturnValue('plan-id-123');

import { db as mockDb } from 'src/database/db';
import { hashPassword as mockHashPassword } from 'src/utils/passwordHash';

const { randomUUID } = require('crypto');

describe('setupCreatorAccountService', () => {
  const TEST_PLAN_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  const mockPayload = {
    token: 'valid-token',
    planId: TEST_PLAN_UUID,
    confirmEmail: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  const mockTokenData = {
    id: 'token-id',
    userId: 'user-id',
    token: 'valid-token',
    isUsed: false,
    expiresAt: new Date(Date.now() + 1000000),
  };

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockHashPassword as jest.Mock).mockResolvedValue('hashed-password');
    (randomUUID as jest.Mock).mockReturnValue('plan-id-123');
  });

  it('should throw error when required fields are missing', async () => {
    const incompletePayload = { ...mockPayload, token: '' };

    await expect(setupCreatorAccountService(incompletePayload)).rejects.toThrow(
      'All fields are required',
    );
  });

  it('should throw error when passwords do not match', async () => {
    const mismatchedPayload = { ...mockPayload, confirmPassword: 'different' };

    await expect(setupCreatorAccountService(mismatchedPayload)).rejects.toThrow(
      'Passwords do not match',
    );
  });

  it('should throw error when password is too short', async () => {
    const shortPasswordPayload = {
      ...mockPayload,
      password: '12345',
      confirmPassword: '12345',
    };

    await expect(
      setupCreatorAccountService(shortPasswordPayload),
    ).rejects.toThrow('Password must be at least 6 characters');
  });

  it('should throw error when token is invalid', async () => {
    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      const tx = {
        select: jest.fn().mockReturnValue({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      };
      return callback(tx);
    });

    mockDb.transaction = mockTransaction;

    await expect(setupCreatorAccountService(mockPayload)).rejects.toThrow(
      'Invalid or expired token',
    );
  });

  it('should throw error when token is already used', async () => {
    const usedTokenData = { ...mockTokenData, isUsed: true };

    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      const tx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([usedTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockUser]),
              }),
            }),
          }),
        update: jest.fn(),
        insert: jest.fn(),
      };
      return callback(tx);
    });

    mockDb.transaction = mockTransaction;

    await expect(setupCreatorAccountService(mockPayload)).rejects.toThrow(
      'Token already used',
    );
  });

  it('should throw error when email does not match token', async () => {
    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      const tx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest
                  .fn()
                  .mockResolvedValue([{ email: 'different@example.com' }]),
              }),
            }),
          }),
        update: jest.fn(),
        insert: jest.fn(),
      };
      return callback(tx);
    });

    mockDb.transaction = mockTransaction;

    await expect(setupCreatorAccountService(mockPayload)).rejects.toThrow(
      'Email does not match token',
    );
  });

  it('should successfully setup creator account', async () => {
    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      const tx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockUser]),
              }),
            }),
          }),
        update: jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue(undefined),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockResolvedValue(undefined),
        }),
      };
      return callback(tx);
    });

    mockDb.transaction = mockTransaction;

    const result = await setupCreatorAccountService(mockPayload);

    expect(mockHashPassword).toHaveBeenCalledWith('password123');

    expect(result).toEqual({
      success: true,
      message: 'Creator account setup successfully',
      statusCode: 200,
      data: {
        userId: 'user-id',
        email: 'test@example.com',
        planId: TEST_PLAN_UUID,
      },
    });
  });

  it('should update user with correct data', async () => {
    let capturedTx: any;

    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      capturedTx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockUser]),
              }),
            }),
          }),
        update: jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue(undefined),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockResolvedValue(undefined),
        }),
      };
      return callback(capturedTx);
    });

    mockDb.transaction = mockTransaction;

    await setupCreatorAccountService(mockPayload);

    expect(capturedTx.update).toHaveBeenCalledWith(expect.any(Object));
    const updateResult = capturedTx.update.mock.results[0].value;
    expect(updateResult.set).toHaveBeenCalledWith({
      passwordHash: 'hashed-password',
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
    });
  });

  it('should insert creator plan with correct data', async () => {
    let capturedTx: any;

    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      capturedTx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockUser]),
              }),
            }),
          }),
        update: jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue(undefined),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockResolvedValue(undefined),
        }),
      };
      return callback(capturedTx);
    });

    mockDb.transaction = mockTransaction;

    await setupCreatorAccountService(mockPayload);

    expect(capturedTx.insert).toHaveBeenCalledWith(expect.any(Object));
    const insertResult = capturedTx.insert.mock.results[0].value;
    expect(insertResult.values).toHaveBeenCalledWith({
      id: expect.any(String),
      planId: TEST_PLAN_UUID,
      creatorId: 'user-id',
    });
  });

  it('should mark token as used', async () => {
    let capturedTx: any;

    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      capturedTx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockUser]),
              }),
            }),
          }),
        update: jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue(undefined),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockResolvedValue(undefined),
        }),
      };
      return callback(capturedTx);
    });

    mockDb.transaction = mockTransaction;

    await setupCreatorAccountService(mockPayload);

    // Check that token was marked as used - should be the second update call
    expect(capturedTx.update).toHaveBeenCalledTimes(2);
    const tokenUpdateResult = capturedTx.update.mock.results[1].value;
    expect(tokenUpdateResult.set).toHaveBeenCalledWith({ isUsed: true });
  });

  it('should resolve try-kiibee slug to plan row uuid before insert', async () => {
    const resolvedUuid = 'aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee';
    let capturedTx: {
      insert: jest.Mock;
      select: jest.Mock;
    };

    const mockTransaction = jest.fn().mockImplementation(async (callback) => {
      capturedTx = {
        select: jest
          .fn()
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockTokenData]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([mockUser]),
              }),
            }),
          })
          .mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([{ id: resolvedUuid }]),
              }),
            }),
          }),
        update: jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue(undefined),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockResolvedValue(undefined),
        }),
      };
      return callback(capturedTx);
    });

    mockDb.transaction = mockTransaction;

    const slugPayload = {
      ...mockPayload,
      planId: 'try-kiibee',
    };

    const result = await setupCreatorAccountService(slugPayload);

    expect(result.data?.planId).toBe(resolvedUuid);
    const insertResult = capturedTx.insert.mock.results[0].value;
    expect(insertResult.values).toHaveBeenCalledWith({
      id: expect.any(String),
      planId: resolvedUuid,
      creatorId: 'user-id',
    });
  });

  it('should handle transaction failures', async () => {
    const mockTransaction = jest
      .fn()
      .mockRejectedValue(new Error('Transaction failed'));

    mockDb.transaction = mockTransaction;

    await expect(setupCreatorAccountService(mockPayload)).rejects.toThrow(
      'Failed to setup creator account',
    );
  });
});
