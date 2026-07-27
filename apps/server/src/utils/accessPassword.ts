import { hashPassword } from './passwordHash';

export async function hashAccessPasswords(raw: string): Promise<string | null> {
  const passwords = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (passwords.length === 0) {
    return null;
  }

  if (passwords.length === 1) {
    return hashPassword(passwords[0]);
  }

  const hashes = await Promise.all(
    passwords.map((password) => hashPassword(password)),
  );
  return JSON.stringify(hashes);
}

export function getPasswordCount(hash: string | null | undefined): number {
  if (!hash) return 0;
  if (!hash.startsWith('[') || !hash.endsWith(']')) {
    return 1;
  }

  try {
    const parsed = JSON.parse(hash);
    return Array.isArray(parsed) ? parsed.length : 1;
  } catch {
    return 1;
  }
}
