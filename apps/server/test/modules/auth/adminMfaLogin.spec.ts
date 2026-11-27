import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { TokenService } from 'src/modules/auth/services/token.service';
import { verifyAdminMfa } from 'src/modules/auth/services/adminMfa.service';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { db } from 'src/database/db';

jest.mock('sanitize-html', () => ({
  __esModule: true,
  default: (value: string) => value,
}));
jest.mock('src/modules/auth/auth.service', () => ({ AuthService: jest.fn() }));
jest.mock('src/modules/auth/services/adminMfa.service', () => ({
  verifyAdminMfa: jest.fn(),
}));
jest.mock('src/services/auditLog.service', () => ({ logAudit: jest.fn() }));
jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));

describe('admin login MFA gate', () => {
  const user = { id: 'admin', email: 'admin@example.com', role: 'admin' };
  const request = { headers: {}, ip: '127.0.0.1' } as any;
  let auth: { login: jest.Mock; createSession: jest.Mock; refresh: jest.Mock };
  let tokens: { generateAuthTokens: jest.Mock; verifyRefreshToken: jest.Mock };
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    auth = {
      login: jest.fn().mockResolvedValue({ success: true, data: user }),
      createSession: jest.fn(),
      refresh: jest.fn(),
    };
    tokens = {
      generateAuthTokens: jest
        .fn()
        .mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' }),
      verifyRefreshToken: jest.fn(),
    };
    controller = new AuthController(
      auth as unknown as AuthService,
      tokens as unknown as TokenService,
    );
  });

  it.each([true, false])(
    'does not issue tokens or sessions before second-factor verification (setup=%s)',
    async (setupRequired) => {
      jest
        .mocked(verifyAdminMfa)
        .mockResolvedValue({ requiresTwoFactor: true, setupRequired });
      const response = await controller.login(
        { email: user.email, password: 'password' },
        request,
      );
      expect(response.data).toMatchObject({
        requiresTwoFactor: true,
        setupRequired,
      });
      expect(tokens.generateAuthTokens).not.toHaveBeenCalled();
      expect(auth.createSession).not.toHaveBeenCalled();
    },
  );

  it('never starts MFA for an invalid password', async () => {
    auth.login.mockRejectedValue(new Error('Invalid credentials'));
    await expect(
      controller.login({ email: user.email, password: 'wrong' }, request),
    ).rejects.toThrow();
    expect(verifyAdminMfa).not.toHaveBeenCalled();
    expect(tokens.generateAuthTokens).not.toHaveBeenCalled();
  });

  it('does not create a session when the second factor fails', async () => {
    jest.mocked(verifyAdminMfa).mockRejectedValue(new Error('Invalid code'));
    await expect(
      controller.login(
        { email: user.email, password: 'password', twoFactorCode: '123456' },
        request,
      ),
    ).rejects.toThrow('Invalid code');
    expect(tokens.generateAuthTokens).not.toHaveBeenCalled();
    expect(auth.createSession).not.toHaveBeenCalled();
  });

  it('issues MFA-marked tokens only after verification and returns enrollment recovery codes', async () => {
    jest
      .mocked(verifyAdminMfa)
      .mockResolvedValue({ verified: true, recoveryCodes: ['recovery'] });
    const response = await controller.login(
      { email: user.email, password: 'password', twoFactorCode: '123456' },
      request,
    );
    expect(verifyAdminMfa).toHaveBeenCalledWith(
      user.id,
      user.email,
      '123456',
      undefined,
    );
    expect(tokens.generateAuthTokens).toHaveBeenCalledWith({
      ...user,
      mfaVerified: true,
    });
    expect(auth.createSession).toHaveBeenCalledTimes(1);
    expect(response.data).toMatchObject({
      accessToken: 'access',
      recoveryCodes: ['recovery'],
    });
  });

  it('keeps viewer login unchanged', async () => {
    auth.login.mockResolvedValue({
      success: true,
      data: { ...user, role: 'viewer' },
    });
    await controller.login(
      { email: user.email, password: 'password' },
      request,
    );
    expect(verifyAdminMfa).not.toHaveBeenCalled();
    expect(tokens.generateAuthTokens).toHaveBeenCalledWith({
      ...user,
      role: 'viewer',
      mfaVerified: undefined,
    });
  });

  it('passes only the signed refresh token MFA claim to refresh validation', async () => {
    tokens.verifyRefreshToken.mockResolvedValue({
      sub: 'admin',
      email: user.email,
      mfa: true,
    });
    await controller.refresh('Bearer refresh');
    expect(auth.refresh).toHaveBeenCalledWith({
      userId: 'admin',
      email: user.email,
      refreshToken: 'refresh',
      mfaVerified: true,
    });
  });
});

describe('access token MFA enforcement', () => {
  let strategy: JwtStrategy;
  const payload = { sub: 'admin', email: 'admin@example.com', role: 'admin' };
  beforeEach(() => {
    strategy = new JwtStrategy(
      { getOrThrow: () => 'test-secret' } as any,
      { isRevoked: jest.fn().mockResolvedValue(false) } as any,
    );
  });
  function withRole(role: string) {
    jest.mocked(db.select).mockReturnValue({
      from: () => ({
        where: () => ({
          limit: async () => [{ id: 'admin', role, isDeleted: false }],
        }),
      }),
    } as never);
  }
  it('rejects legacy admin access tokens with no MFA claim', async () => {
    withRole('admin');
    await expect(strategy.validate(payload)).rejects.toThrow(
      'Admin authenticator verification required',
    );
  });
  it('checks the actual database role so a stale viewer token cannot bypass MFA after promotion', async () => {
    withRole('admin');
    await expect(
      strategy.validate({ ...payload, role: 'viewer' }),
    ).rejects.toThrow('Admin authenticator verification required');
  });
  it('accepts verified admin tokens and ordinary viewer tokens', async () => {
    withRole('admin');
    await expect(
      strategy.validate({ ...payload, mfa: true }),
    ).resolves.toMatchObject({ userId: 'admin' });
    withRole('viewer');
    await expect(
      strategy.validate({ ...payload, role: 'viewer' }),
    ).resolves.toMatchObject({ userId: 'admin' });
  });
});
