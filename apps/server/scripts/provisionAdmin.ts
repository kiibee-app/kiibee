import 'dotenv/config';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Client } from 'pg';

// Explicit operator action; this is never called automatically at startup/seed.
async function main() {
  const email = process.env.ADMIN_PROVISION_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PROVISION_PASSWORD;
  const apply = process.argv.includes('--apply');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error('Set ADMIN_PROVISION_EMAIL to the target email.');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  if (apply && !password)
    throw new Error(
      'Set ADMIN_PROVISION_PASSWORD securely in the environment.',
    );
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? true : false,
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      `provision-admin:${email}`,
    ]);
    const { rows: accounts } = await client.query(
      'SELECT id, role, status FROM users WHERE lower(email) = $1 AND is_deleted = false FOR UPDATE',
      [email],
    );
    if (accounts.length > 1)
      throw new Error(
        'Multiple active accounts found; resolve duplicates before provisioning.',
      );
    const current = accounts[0];
    if (current?.role === 'admin') {
      await client.query('ROLLBACK');
      console.log(
        JSON.stringify({
          email,
          role: current.role,
          status: current.status,
          action: 'Existing admin preserved; password and MFA unchanged.',
        }),
      );
      return;
    }
    if (
      current &&
      (current.role !== 'creator' ||
        !process.argv.includes('--replace-creator'))
    )
      throw new Error(
        'Existing account found. Creator replacement requires --replace-creator.',
      );
    if (!apply) {
      await client.query('ROLLBACK');
      console.log(
        JSON.stringify({
          email,
          existingRole: current?.role ?? null,
          action: current
            ? 'Would replace the creator role with admin and set the supplied password. Run with --apply.'
            : 'Would create an active admin. Run with --apply.',
        }),
      );
      return;
    }
    const passwordHash = await bcrypt.hash(password!, 12);
    const id = current?.id ?? randomUUID();
    if (current) {
      await client.query(
        "UPDATE users SET role = 'admin', password_hash = $2, status = 'active', is_active = true, is_email_verified = true, updated_at = now() WHERE id = $1",
        [id, passwordHash],
      );
      await client.query('DELETE FROM user_sessions WHERE user_id = $1', [id]);
      await client.query('DELETE FROM users_token WHERE user_id = $1', [id]);
    } else {
      await client.query(
        "INSERT INTO users (id, email, password_hash, role, status, is_email_verified, is_active) VALUES ($1, $2, $3, 'admin', 'active', true, true)",
        [id, email, passwordHash],
      );
    }
    const { rows: verified } = await client.query(
      'SELECT role, status, password_hash FROM users WHERE id = $1',
      [id],
    );
    if (
      verified[0]?.role !== 'admin' ||
      verified[0]?.status !== 'active' ||
      !(await bcrypt.compare(password!, verified[0].password_hash))
    )
      throw new Error('Admin verification failed; transaction rolled back.');
    await client.query('COMMIT');
    console.log(
      JSON.stringify({
        email,
        role: 'admin',
        status: 'active',
        passwordVerified: true,
        creatorRoleRemoved: Boolean(current),
        authenticatorSetupRequired: true,
      }),
    );
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}
main().catch(() => {
  console.error(
    'Admin provisioning failed; no credentials logged. Check the database configuration and account/billing state.',
  );
  process.exitCode = 1;
});
