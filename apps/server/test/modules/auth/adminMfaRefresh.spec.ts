import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { db } from 'src/database/db';
import { AuthService } from 'src/modules/auth/auth.service';
import { TokenService } from 'src/modules/auth/services/token.service';

jest.mock('sanitize-html', () => ({
  __esModule: true,
  default: (value: string) => value,
}));
jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('new-hash'),
}));

describe('MFA refresh token enforcement', () => {
  let tokens: TokenService;
  let auth: AuthService;
  let sessionLookup: jest.Mock;
  let inserted: jest.Mock;
  let role: string;
  const jwt = new JwtService();
  const user = {
    userId: 'admin',
    email: 'admin@example.com',
    refreshToken: 'refresh',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    role = 'admin';
    const config = new ConfigService({
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
    });
    tokens = new TokenService(jwt, config);
    auth = new AuthService(tokens, config);
    sessionLookup = jest.fn().mockResolvedValue({
      id: 'session',
      refreshTokenHash: 'old-hash',
      expiresAt: new Date('2099-01-01'),
    });
    inserted = jest.fn().mockResolvedValue(undefined);
    const tx = {
      query: {
        users: { findFirst: async () => ({ role }) },
        userSessions: { findFirst: sessionLookup },
      },
      delete: () => ({
        where: () => ({ returning: async () => [{ id: 'session' }] }),
      }),
      insert: () => ({ values: inserted }),
    };
    jest
      .mocked(db.transaction)
      .mockImplementation((callback) => callback(tx as never));
  });

  it('rejects an existing admin refresh session lacking MFA verification', async () => {
    await expect(auth.refresh(user)).rejects.toThrow(
      'Admin authenticator verification required',
    );
    expect(sessionLookup).not.toHaveBeenCalled();
    expect(inserted).not.toHaveBeenCalled();
  });

  it('preserves the MFA claim through token rotation', async () => {
    const result = await auth.refresh({ ...user, mfaVerified: true });
    expect(
      await tokens.verifyAccessToken(result.data.accessToken),
    ).toMatchObject({ sub: 'admin', mfa: true });
    expect(
      await tokens.verifyRefreshToken(result.data.refreshToken),
    ).toMatchObject({ sub: 'admin', mfa: true });
    expect(inserted).toHaveBeenCalledTimes(1);
  });

  it('does not add an MFA claim for ordinary viewer login or refresh', async () => {
    role = 'viewer';
    const result = await auth.refresh(user);
    expect(jwt.decode(result.data.accessToken)).not.toHaveProperty('mfa');
    expect(
      await tokens.verifyRefreshToken(result.data.refreshToken),
    ).toMatchObject({ mfa: false });
  });

  it('cannot make an unsigned MFA claim valid by tampering with a refresh JWT', async () => {
    const initial = await tokens.generateAuthTokens({
      id: 'admin',
      email: user.email,
      role: 'admin',
    });
    expect(await tokens.verifyRefreshToken(initial.refreshToken)).toMatchObject(
      { mfa: false },
    );
    const parts = initial.refreshToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    parts[1] = Buffer.from(JSON.stringify({ ...payload, mfa: true })).toString(
      'base64url',
    );
    await expect(tokens.verifyRefreshToken(parts.join('.'))).rejects.toThrow(
      'Invalid or expired refresh token',
    );
  });

  it('still requires the matching persisted refresh token after MFA verification', async () => {
    jest.mocked(bcrypt.compare).mockImplementationOnce(async () => false);
    await expect(auth.refresh({ ...user, mfaVerified: true })).rejects.toThrow(
      'Session expired or revoked',
    );
    expect(inserted).not.toHaveBeenCalled();
  });
});
