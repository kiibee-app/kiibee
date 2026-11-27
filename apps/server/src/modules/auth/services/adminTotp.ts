import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

export function base32Decode(secret: string): Buffer {
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of secret) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) throw new Error('Invalid TOTP secret');
    value = (value << 5) | digit;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

// RFC 6238 / Google Authenticator: SHA-1, six digits, 30-second period.
export function totp(secret: string, step: number, digits = 6): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = createHmac('sha1', base32Decode(secret))
    .update(counter)
    .digest();
  const offset = digest[digest.length - 1] & 15;
  return String(
    (digest.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits,
  ).padStart(digits, '0');
}

export function verifyTotp(
  secret: string,
  code: string,
  lastUsedStep: number | null,
  now = Date.now(),
): number | null {
  if (!/^\d{6}$/.test(code)) return null;
  const current = Math.floor(now / 30000);
  for (const step of [current, current - 1, current + 1]) {
    if (step < 0 || (lastUsedStep != null && step <= lastUsedStep)) continue;
    if (timingSafeEqual(Buffer.from(totp(secret, step)), Buffer.from(code)))
      return step;
  }
  return null;
}

function encryptionKey(): Buffer {
  const key = process.env.ADMIN_MFA_ENCRYPTION_KEY;
  if (!key || !/^[a-fA-F0-9]{64}$/.test(key)) {
    throw new Error(
      'ADMIN_MFA_ENCRYPTION_KEY must be a 32-byte hexadecimal key',
    );
  }
  return Buffer.from(key, 'hex');
}

export function encryptMfaSecret(secret: string, userId: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  cipher.setAAD(Buffer.from(userId));
  const encrypted = Buffer.concat([
    cipher.update(secret, 'utf8'),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString('base64'))
    .join('.');
}

export function decryptMfaSecret(encrypted: string, userId: string): string {
  const [iv, tag, ciphertext] = encrypted
    .split('.')
    .map((part) => Buffer.from(part, 'base64'));
  const cipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  cipher.setAAD(Buffer.from(userId));
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(ciphertext), cipher.final()]).toString(
    'utf8',
  );
}

export function hashRecoveryCode(code: string): string {
  return createHash('sha256')
    .update(code.replace(/[-\s]/g, '').toLowerCase())
    .digest('hex');
}

export function newRecoveryCodes(): string[] {
  return Array.from({ length: 10 }, () =>
    randomBytes(10)
      .toString('hex')
      .match(/.{1,5}/g)!
      .join('-'),
  );
}
