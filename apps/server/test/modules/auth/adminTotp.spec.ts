import {
  base32Decode,
  base32Encode,
  decryptMfaSecret,
  encryptMfaSecret,
  hashRecoveryCode,
  newRecoveryCodes,
  totp,
  verifyTotp,
} from 'src/modules/auth/services/adminTotp';

describe('admin TOTP cryptography', () => {
  const secret = base32Encode(Buffer.from('12345678901234567890'));
  const originalKey = process.env.ADMIN_MFA_ENCRYPTION_KEY;
  beforeEach(() => {
    process.env.ADMIN_MFA_ENCRYPTION_KEY = 'ab'.repeat(32);
  });
  afterAll(() => {
    if (originalKey === undefined) delete process.env.ADMIN_MFA_ENCRYPTION_KEY;
    else process.env.ADMIN_MFA_ENCRYPTION_KEY = originalKey;
  });

  it('encodes a Google Authenticator-compatible base32 key', () => {
    expect(secret).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
    expect(base32Decode(secret).toString()).toBe('12345678901234567890');
  });

  // RFC 6238 Appendix B, SHA-1 test vectors.
  it.each([
    [59, '94287082'],
    [1111111109, '07081804'],
    [1111111111, '14050471'],
    [1234567890, '89005924'],
    [2000000000, '69279037'],
    [20000000000, '65353130'],
  ])('matches RFC 6238 at %s seconds', (seconds, expected) => {
    expect(totp(secret, Math.floor(Number(seconds) / 30), 8)).toBe(expected);
    expect(totp(secret, Math.floor(Number(seconds) / 30))).toBe(
      String(expected).slice(-6),
    );
  });

  it('accepts a 30-second clock skew but rejects stale, malformed and replayed codes', () => {
    const now = 1234567890000;
    const step = Math.floor(now / 30000);
    expect(verifyTotp(secret, totp(secret, step), null, now)).toBe(step);
    expect(verifyTotp(secret, totp(secret, step - 1), null, now)).toBe(
      step - 1,
    );
    expect(verifyTotp(secret, totp(secret, step + 1), null, now)).toBe(
      step + 1,
    );
    expect(verifyTotp(secret, totp(secret, step), step, now)).toBeNull();
    expect(verifyTotp(secret, totp(secret, step - 2), null, now)).toBeNull();
    expect(verifyTotp(secret, '12345', null, now)).toBeNull();
    expect(verifyTotp(secret, 'abcdef', null, now)).toBeNull();
  });

  it('encrypts seeds with randomized authenticated encryption bound to the admin', () => {
    const encrypted = encryptMfaSecret(secret, 'admin-1');
    expect(encrypted).not.toContain(secret);
    expect(encryptMfaSecret(secret, 'admin-1')).not.toBe(encrypted);
    expect(decryptMfaSecret(encrypted, 'admin-1')).toBe(secret);
    expect(() => decryptMfaSecret(encrypted, 'admin-2')).toThrow();
    const parts = encrypted.split('.');
    const tag = Buffer.from(parts[1], 'base64');
    tag[0] ^= 1;
    parts[1] = tag.toString('base64');
    expect(() => decryptMfaSecret(parts.join('.'), 'admin-1')).toThrow();
  });

  it('fails closed without an encryption key', () => {
    delete process.env.ADMIN_MFA_ENCRYPTION_KEY;
    expect(() => encryptMfaSecret(secret, 'admin')).toThrow(
      'ADMIN_MFA_ENCRYPTION_KEY',
    );
  });

  it('generates ten unique recovery codes and hashes normalized input', () => {
    const codes = newRecoveryCodes();
    expect(new Set(codes).size).toBe(10);
    expect(
      codes.every((code) => /^[a-f0-9]{5}(-[a-f0-9]{5}){3}$/.test(code)),
    ).toBe(true);
    expect(hashRecoveryCode(codes[0].toUpperCase().replace(/-/g, ' '))).toBe(
      hashRecoveryCode(codes[0]),
    );
    expect(hashRecoveryCode(codes[0])).not.toContain(codes[0]);
  });
});
