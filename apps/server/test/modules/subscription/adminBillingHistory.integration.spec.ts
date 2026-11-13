import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { subscriptionBillingRows } from 'src/modules/payment/services/subscriptionBillingRows';
import { settleAdminBillingRequest } from 'src/modules/subscription/services/adminBillingRequest.service';

jest.mock('src/database/db', () => ({ db: {} }));
const integration = process.env.BILLING_TEST_DB ? describe : describe.skip;
integration('admin subscription billing lifecycle (isolated Postgres)', () => {
  const client = new Client({ connectionString: process.env.BILLING_TEST_DB });
  const database = drizzle(client);
  beforeAll(async () => {
    await client.connect();
    await client.query(`CREATE SCHEMA billing_test; SET search_path TO billing_test;
      CREATE TABLE users (id text primary key, email text, full_name text, first_name text, last_name text);
      CREATE TABLE creator_info (user_id text, company_name text);
      CREATE TABLE plans (id text, name text);
      CREATE TABLE subscriptions (id text, plan_id text);
      CREATE TABLE subscription_payments_history (id text, creator_id text, subscription_id text, transaction_id text, amount numeric, currency text, status text, payment_method_type text, created_at timestamp);
      INSERT INTO users VALUES ('creator', 'creator@example.com', 'Test Creator', 'Test', 'Creator'), ('other', 'other@example.com', 'Other', 'Other', 'User');
      INSERT INTO creator_info VALUES ('creator', 'Test Company');
      INSERT INTO plans VALUES ('pro', 'Pro'), ('startup', 'Start-up');
      INSERT INTO subscriptions VALUES ('sub', 'pro');`);
    await client.query(`CREATE TABLE admin_billing_requests (
      id text PRIMARY KEY, creator_id text NOT NULL REFERENCES users(id),
      plan_id text NOT NULL, plan_name text NOT NULL, amount numeric(10,2) NOT NULL,
      currency text NOT NULL, status text NOT NULL DEFAULT 'pending', transaction_id text,
      email_status text NOT NULL DEFAULT 'pending', email_sent_at timestamp,
      created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now()
    )`);
  });
  afterAll(async () => {
    await client.query('DROP SCHEMA billing_test CASCADE');
    await client.end();
  });
  beforeEach(async () => {
    await client.query(
      'TRUNCATE admin_billing_requests, subscription_payments_history',
    );
  });

  async function pending() {
    await client.query(
      `INSERT INTO admin_billing_requests (id, creator_id, plan_id, plan_name, amount, currency, email_status) VALUES ('request', 'creator', 'pro', 'Pro', 399, 'DKK', 'sent')`,
    );
  }
  it('shows an unpaid assignment before any ePay transaction exists', async () => {
    await pending();
    const rows = await subscriptionBillingRows(
      1,
      'creator',
      undefined,
      database,
    );
    expect(rows).toEqual([
      expect.objectContaining({
        id: 'request',
        status: 'pending',
        description: 'Pro',
        amount: '399.00',
        emailStatus: 'sent',
        reference: null,
      }),
    ]);
    expect(
      await subscriptionBillingRows(1, 'other', undefined, database),
    ).toHaveLength(0);
    expect(
      await subscriptionBillingRows(1, undefined, '%Test Company%', database),
    ).toHaveLength(1);
    expect(
      await subscriptionBillingRows(1, undefined, '%missing%', database),
    ).toHaveLength(0);
  });
  it.each(['completed', 'failed'] as const)(
    'updates the same request to %s and hides the duplicate transaction',
    async (status) => {
      await pending();
      await settleAdminBillingRequest(database, {
        creatorId: 'creator',
        planId: 'pro',
        transactionId: 'epay-1',
        status,
        amount: '425',
        currency: 'DKK',
      });
      await client.query(
        `INSERT INTO subscription_payments_history VALUES ('payment', 'creator', 'sub', 'epay-1', 425, 'DKK', $1, 'card', now())`,
        [status],
      );
      const rows = await subscriptionBillingRows(
        1,
        'creator',
        undefined,
        database,
      );
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        id: 'request',
        status,
        amount: '425.00',
        reference: 'epay-1',
      });
    },
  );
  it('does not settle another plan and can complete a failed request after retry', async () => {
    await pending();
    await settleAdminBillingRequest(database, {
      creatorId: 'creator',
      planId: 'startup',
      transactionId: 'unrelated',
      status: 'completed',
      amount: '99',
      currency: 'DKK',
    });
    expect(
      (await subscriptionBillingRows(1, 'creator', undefined, database))[0]
        .status,
    ).toBe('pending');
    await settleAdminBillingRequest(database, {
      creatorId: 'creator',
      planId: 'pro',
      transactionId: 'failed',
      status: 'failed',
      amount: '399',
      currency: 'DKK',
    });
    await settleAdminBillingRequest(database, {
      creatorId: 'creator',
      planId: 'pro',
      transactionId: 'paid',
      status: 'completed',
      amount: '399',
      currency: 'DKK',
    });
    expect(
      (await subscriptionBillingRows(1, 'creator', undefined, database))[0],
    ).toMatchObject({ id: 'request', status: 'completed', reference: 'paid' });
  });
  it('keeps later renewal transactions and paginates pending requests', async () => {
    await pending();
    await settleAdminBillingRequest(database, {
      creatorId: 'creator',
      planId: 'pro',
      transactionId: 'first',
      status: 'completed',
      amount: '399',
      currency: 'DKK',
    });
    await client.query(
      `INSERT INTO subscription_payments_history VALUES ('renewal', 'creator', 'sub', 'renewal-1', 399, 'DKK', 'completed', 'card', now())`,
    );
    expect(
      await subscriptionBillingRows(1, 'creator', undefined, database),
    ).toHaveLength(2);
    await client.query(
      `INSERT INTO admin_billing_requests (id, creator_id, plan_id, plan_name, amount, currency) SELECT 'pending-' || i, 'creator', 'pro', 'Pro', 399, 'DKK' FROM generate_series(1, 25) i`,
    );
    expect(
      await subscriptionBillingRows(1, 'creator', undefined, database),
    ).toHaveLength(21);
    expect(
      await subscriptionBillingRows(2, 'creator', undefined, database),
    ).toHaveLength(7);
  });
});
