import { db } from 'src/database/db';
import { subscriptionPaymentsHistory } from 'src/database/schema';
import { capturePayment } from 'src/modules/payment/services/capturePayment.service';
import { handleSubscriptionPayment } from 'src/modules/subscription/hooks/subscriptionPayWebhook';
import { settleAdminBillingRequest } from 'src/modules/subscription/services/adminBillingRequest.service';

jest.mock('src/database/db', () => ({
  db: {
    select: jest.fn(),
    transaction: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    query: {
      subscriptionPaymentsHistory: { findFirst: jest.fn() },
      subscriptions: { findFirst: jest.fn() },
      userCardInfo: { findFirst: jest.fn() },
    },
  },
}));
jest.mock('src/modules/payment/services/capturePayment.service');
jest.mock('src/modules/subscription/services/adminBillingRequest.service');
jest.mock('src/modules/subscription/services/deleteSubscription.service');
jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn().mockResolvedValue(true),
}));

describe('subscription payment billing status', () => {
  const body = {
    transaction: {
      id: 'tx-1',
      customerId: 'creator',
      reference: 'plan',
      amount: 39900,
      currency: 'DKK',
      state: 'SUCCESS',
      subscriptionId: 'agreement',
    },
  };
  beforeEach(() => jest.clearAllMocks());
  it('ignores duplicate completed transactions', async () => {
    jest
      .mocked(db.query.subscriptionPaymentsHistory.findFirst)
      .mockResolvedValue({ status: 'completed' } as never);
    await handleSubscriptionPayment(body);
    expect(capturePayment).not.toHaveBeenCalled();
    expect(settleAdminBillingRequest).not.toHaveBeenCalled();
  });
  it.each([false, true])(
    'completes the pending admin request (previous failed transaction: %s)',
    async (previousFailed) => {
      const existing = previousFailed
        ? { id: 'pay_tx-1', status: 'failed' }
        : undefined;
      jest
        .mocked(db.query.subscriptionPaymentsHistory.findFirst)
        .mockResolvedValue(existing as never);
      jest.mocked(capturePayment).mockResolvedValue({ success: true } as never);
      jest
        .mocked(db.query.subscriptions.findFirst)
        .mockResolvedValue({ id: 'sub', agreementId: 'agreement' } as never);
      jest
        .mocked(db.query.userCardInfo.findFirst)
        .mockResolvedValue({ id: 'card' } as never);
      const rows = (value: unknown[]) => ({
        from: () => ({
          where: () => ({ limit: async () => value, for: async () => value }),
        }),
      });
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          rows([{ id: 'plan', price: 399, billingCycle: 'monthly' }]) as never,
        )
        .mockReturnValueOnce(rows([]) as never);
      const updateHistory = jest
        .fn()
        .mockReturnValue({ where: async () => undefined });
      const insertHistory = jest.fn().mockResolvedValue(undefined);
      const tx = {
        select: jest
          .fn()
          .mockReturnValueOnce(rows([{ id: 'creator' }]))
          .mockReturnValueOnce(rows([{ id: 'cp' }])),
        query: {
          subscriptionPaymentsHistory: { findFirst: async () => existing },
          subscriptions: { findFirst: async () => ({ id: 'sub' }) },
        },
        update: (table: unknown) => ({
          set:
            table === subscriptionPaymentsHistory
              ? updateHistory
              : () => ({ where: async () => undefined }),
        }),
        insert: () => ({ values: insertHistory }),
      };
      jest
        .mocked(db.transaction)
        .mockImplementation(async (callback) => callback(tx as never));
      await handleSubscriptionPayment(body);
      expect(settleAdminBillingRequest).toHaveBeenCalledWith(
        tx,
        expect.objectContaining({
          creatorId: 'creator',
          planId: 'plan',
          transactionId: 'tx-1',
          status: 'completed',
          amount: '399',
        }),
      );
      if (previousFailed) {
        expect(updateHistory).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'completed' }),
        );
        expect(insertHistory).not.toHaveBeenCalled();
      } else {
        expect(insertHistory).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'completed' }),
        );
      }
    },
  );
  it('marks the admin request failed when ePay reports failure', async () => {
    jest
      .mocked(db.query.subscriptionPaymentsHistory.findFirst)
      .mockResolvedValue(undefined);
    jest
      .mocked(db.query.subscriptions.findFirst)
      .mockResolvedValue({ id: 'sub', endAt: new Date(0) } as never);
    jest.mocked(db.update).mockReturnValue({
      set: () => ({ where: async () => undefined }),
    } as never);
    const values = jest.fn().mockResolvedValue(undefined);
    jest.mocked(db.insert).mockReturnValue({ values } as never);
    jest.mocked(db.select).mockReturnValue({
      from: () => ({ where: () => ({ limit: async () => [] }) }),
    } as never);
    await handleSubscriptionPayment({
      transaction: { ...body.transaction, state: 'FAILED' },
    });
    expect(settleAdminBillingRequest).toHaveBeenCalledWith(
      db,
      expect.objectContaining({
        creatorId: 'creator',
        planId: 'plan',
        transactionId: 'tx-1',
        status: 'failed',
      }),
    );
    expect(capturePayment).not.toHaveBeenCalled();
  });
});
