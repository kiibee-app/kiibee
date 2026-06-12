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
