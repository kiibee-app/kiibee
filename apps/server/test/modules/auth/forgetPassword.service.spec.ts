jest.mock('src/database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('src/logger/logger');
jest.mock('src/utils/backgroundTask');
jest.mock('src/lib/sendTemplateEmail');
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
  randomUUID: jest.fn(),
}));

import { logger } from 'src/logger/logger';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { Time } from 'src/utils/constant';

// Import after mocks
import { forgetPasswordService } from 'src/modules/auth/services/forgetPassword.service';
import { db } from 'src/database/db';

const mockDb = db as jest.Mocked<typeof db>;
const mockRunInBackground = runInBackground as jest.MockedFunction<
  typeof runInBackground
>;
mockRunInBackground.mockImplementation(() => {
  // Do nothing - runInBackground is fire-and-forget
});
const mockSendTemplateEmail = sendTemplateEmail as jest.MockedFunction<
  typeof sendTemplateEmail
>;

import { randomBytes, randomUUID } from 'crypto';

describe('forgetPasswordService', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'John',
    isDeleted: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FRONTEND_URL = 'https://app.example.com';

    (randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('mocked-token'),
    });
    (randomUUID as jest.Mock).mockReturnValue('mocked-uuid');
  });

  afterEach(() => {
    delete process.env.FRONTEND_URL;
  });

  it('should throw error when email is not provided', async () => {
    await expect(forgetPasswordService('')).rejects.toThrow(
      'Email is required',
    );
  });

  it('should return generic success when user is not found', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockDb.select = mockSelect;

    const result = await forgetPasswordService('nonexistent@example.com');
    expect(result.message).toBe('Password reset link sent if user exists');
  });

  it('should return generic success when user is deleted', async () => {
    // Since the query filters out deleted users, it should return []
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockDb.select = mockSelect;

    const result = await forgetPasswordService('test@example.com');
    expect(result.message).toBe('Password reset link sent if user exists');
  });

  it('should successfully send password reset link', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    });
    mockDb.select = mockSelect;
    mockDb.insert = mockInsert;

    // Mock the insert to return the values function

    mockSendTemplateEmail.mockResolvedValue(true);

    const result = await forgetPasswordService('test@example.com');

    expect(randomBytes).toHaveBeenCalledWith(32);
    expect(randomUUID).toHaveBeenCalled();

    expect(mockInsert).toHaveBeenCalledWith(expect.any(Object)); // usersToken table
    const insertCall = mockInsert.mock.results[0].value;
    expect(insertCall.values).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mocked-uuid',
        userId: 'user-id',
        token: 'mocked-token',
        type: 'reset_password',
        expiresAt: expect.any(Date),
      }),
    );

    expect(mockRunInBackground).toHaveBeenCalledWith(expect.any(Promise));

    expect(result).toEqual({
      success: true,
      message: 'Password reset link sent if user exists',
      statusCode: 200,
      data: null,
    });
  });

  it('should generate correct reset link', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    });
    mockDb.select = mockSelect;
    mockDb.insert = mockInsert;

    mockSendTemplateEmail.mockResolvedValue(true);

    await forgetPasswordService('test@example.com');

    expect(mockSendTemplateEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Reset Your Kiibee Password',
      templateName: 'resetPassword',
      variables: {
        name: 'John',
        resetLink:
          'https://app.example.com/auth/forget-password?token=mocked-token',
      },
    });
  });

  it('should set correct token expiration time', async () => {
    const beforeCall = Date.now();
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    });
    mockDb.select = mockSelect;
    mockDb.insert = mockInsert;

    mockSendTemplateEmail.mockResolvedValue(true);

    await forgetPasswordService('test@example.com');

    const afterCall = Date.now();
    const insertResult = mockInsert.mock.results[0].value;
    const valuesCall = insertResult.values.mock.calls[0][0];

    expect(valuesCall.expiresAt.getTime()).toBeGreaterThanOrEqual(
      beforeCall + Time.FIFTEEN_MINUTES,
    );
    expect(valuesCall.expiresAt.getTime()).toBeLessThanOrEqual(
      afterCall + Time.FIFTEEN_MINUTES,
    );
  });

  // it('should handle database errors gracefully', async () => {
  //   const mockSelect = jest.fn().mockRejectedValue(new Error('Database connection failed'));
  //   mockDb.select = mockSelect;

  //   await expect(forgetPasswordService('test@example.com')).rejects.toThrow('Failed to process forget password request');

  //   expect(mockLogger.error).toHaveBeenCalledWith(
  //     'Error in forgetPasswordService:',
  //     expect.any(Error)
  //   );
  // });

  it('should handle email sending failure gracefully', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    });
    mockDb.select = mockSelect;
    mockDb.insert = mockInsert;

    mockSendTemplateEmail.mockResolvedValue(false);

    const result = await forgetPasswordService('test@example.com');

    // Should still succeed since email failure is handled in background
    expect(result).toEqual({
      success: true,
      message: 'Password reset link sent if user exists',
      statusCode: 200,
      data: null,
    });
  });

  // it('should rethrow HttpException errors', async () => {
  //   const httpError = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  //   const mockSelect = jest.fn().mockRejectedValue(httpError);
  //   mockDb.select = mockSelect;

  //   try {
  //     await forgetPasswordService('test@example.com');
  //     fail('Expected HttpException to be thrown');
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(HttpException);
  //     expect(error.message).toBe('Bad Request');
  //   }
  // });
});
