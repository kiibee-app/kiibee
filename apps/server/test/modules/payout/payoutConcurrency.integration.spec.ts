jest.mock(
  'src/modules/payout/services/refreshPendingPayoutFees.service',
  () => ({ refreshPendingPayoutFees: jest.fn().mockResolvedValue(undefined) }),
);
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { db } from 'src/database/db';
import { approvePayoutRequestService as approve } from 'src/modules/payout/services/approvePayoutRequest.service';
import { rejectPayoutRequestService as reject } from 'src/modules/payout/services/rejectPayoutRequest.service';
import { handlePayoutWebhookService as webhook } from 'src/modules/payout/hooks/payoutWebhook';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';

jest.mock('src/database/db', () => ({
  db: { transaction: jest.fn(), select: jest.fn(), update: jest.fn() },
}));
jest.mock('src/modules/payout/services/payoutInfo.service', () => ({
  payoutInfoService: jest
    .fn()
    .mockResolvedValue({ creator: { email: 'test@example.com' } }),
}));
jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn().mockResolvedValue(true),
}));
jest.mock('src/utils/backgroundTask', () => ({ runInBackground: jest.fn() }));
jest.mock('src/logger/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const integration = process.env.PAYOUT_TEST_DB ? describe : describe.skip;
integration('payout concurrency in isolated PostgreSQL', () => {
  const schema = `payout_concurrency_${process.pid}`;
  const admin = new Pool({ connectionString: process.env.PAYOUT_TEST_DB });
  const pool = new Pool({
    connectionString: process.env.PAYOUT_TEST_DB,
    options: `-c search_path=${schema}`,
    max: 10,
  });
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${schema}`);
    await pool.query(`
      CREATE TABLE creator_wallets (id text primary key, creator_id text, amount numeric(10,2), currency text default 'DKK', created_at timestamptz default now(), updated_at timestamptz default now());
      CREATE TABLE creator_payouts (id text primary key, creator_id text, raw_amount numeric(10,2), amount numeric(10,2), currency text default 'DKK', status text default 'pending', credit_no text, bank_account_info text, "cardNo" text, payout_date timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
      CREATE TABLE creator_payout_requests (fee_breakdown jsonb, id text primary key, creator_id text, payout_id text, payment_method_id text, raw_amount numeric(10,2), processing_fee numeric(10,2), platform_fee numeric(10,2), payable_amount numeric(10,2), currency text default 'DKK', status text default 'pending', created_at timestamptz default now(), updated_at timestamptz default now());
    `);
    const database = drizzle(pool);
    jest
      .mocked(db.transaction)
      .mockImplementation(database.transaction.bind(database));
    jest.mocked(db.select).mockImplementation(database.select.bind(database));
    jest.mocked(db.update).mockImplementation(database.update.bind(database));
  });
  afterAll(async () => {
    await pool.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  });
  beforeEach(async () => {
    jest.mocked(sendTemplateEmail).mockClear();
    await pool.query(
      "TRUNCATE creator_wallets, creator_payout_requests, creator_payouts; INSERT INTO creator_wallets (id, creator_id, amount) VALUES ('wallet','creator',1000)",
    );
  });
  async function pending(id: string, amount = 700) {
    await pool.query(
      'INSERT INTO creator_payouts (id, creator_id, raw_amount, amount) VALUES ($1, $2, $3, $3)',
      [id, 'creator', amount],
    );
    await pool.query(
      `INSERT INTO creator_payout_requests (id, creator_id, payout_id, raw_amount, fee_breakdown) VALUES ($1, $2, $1, $3, '{"fixedPlatformFee":null,"platformFeePercentage":0,"processingFeePercentage":0}')`,
      [id, 'creator', amount],
    );
  }
  async function balance() {
    return (await pool.query('SELECT amount FROM creator_wallets')).rows[0]
      .amount;
  }
  async function status(id: string) {
    return (
      await pool.query(
        'SELECT status FROM creator_payout_requests WHERE id=$1',
        [id],
      )
    ).rows[0].status;
  }
  const event = (id: string) => ({ reference: id, state: 'completed' });
  it('debits once for simultaneous approvals of the same request', async () => {
    await pending('same');
    const results = await Promise.allSettled(
      Array.from({ length: 8 }, () => approve('same')),
    );
    expect(
      results.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    expect(await balance()).toBe('300.00');
    expect(await status('same')).toBe('completed');
    expect(sendTemplateEmail).toHaveBeenCalledTimes(1);
  });
  it('prevents separate concurrent requests from overdrawing a shared wallet', async () => {
    await pending('one');
    await pending('two');
    const results = await Promise.allSettled([approve('one'), approve('two')]);
    expect(
      results.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    expect(await balance()).toBe('300.00');
    expect([await status('one'), await status('two')].sort()).toEqual([
      'completed',
      'pending',
    ]);
  });
  it('does not debit twice for simultaneous webhook deliveries', async () => {
    await pending('hook');
    await Promise.all(Array.from({ length: 8 }, () => webhook(event('hook'))));
    expect(await balance()).toBe('300.00');
    expect(sendTemplateEmail).toHaveBeenCalledTimes(1);
  });
  it('settles once when manual approval races a webhook', async () => {
    await pending('race');
    await Promise.allSettled([approve('race'), webhook(event('race'))]);
    expect(await balance()).toBe('300.00');
    expect(await status('race')).toBe('completed');
    expect(sendTemplateEmail).toHaveBeenCalledTimes(1);
  });
  it('does not let rejection overwrite a concurrent completed approval', async () => {
    await pending('decision');
    await Promise.allSettled([approve('decision'), reject('decision')]);
    const finalStatus = await status('decision');
    expect(['completed', 'rejected']).toContain(finalStatus);
    expect(await balance()).toBe(
      finalStatus === 'completed' ? '300.00' : '1000.00',
    );
    expect(sendTemplateEmail).toHaveBeenCalledTimes(1);
  });
  it('rolls back webhook completion if the wallet has insufficient funds', async () => {
    await pending('too-large', 1200);
    await expect(webhook(event('too-large'))).rejects.toBeDefined();
    expect(await status('too-large')).toBe('pending');
    expect(await balance()).toBe('1000.00');
    expect(sendTemplateEmail).not.toHaveBeenCalled();
  });
});
