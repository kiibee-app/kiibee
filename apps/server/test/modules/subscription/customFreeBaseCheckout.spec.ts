import { db } from 'src/database/db';
import { createSubscriptionService } from 'src/modules/subscription/services/createSubscription.service';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';

const mockEpayPost = jest.fn();
jest.mock('axios', () => ({
  create: () => ({ post: (...args: unknown[]) => mockEpayPost(...args) }),
}));
jest.mock('src/database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    query: {
      users: { findFirst: jest.fn() },
      subscriptions: { findFirst: jest.fn() },
    },
  },
}));
jest.mock(
  'src/modules/subscription/services/adminBillingRequest.service',
  () => ({ updatePendingCheckoutAmount: jest.fn() }),
);
jest.mock('src/modules/subscription/services/deleteSubscription.service');
jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn(),
}));
jest.mock('src/utils/webhookUrl', () => ({
  getSubscriptionWebhookUrl: () => 'https://example.com/webhook',
}));

function rows(value: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    orderBy: () => query,
    limit: async () => value,
  };
  return query as never;
}
describe('custom price on a free base plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each(['draft', 'pending'])(
    'creates a 100 DKK paid ePay checkout for a %s offer, never a free activation',
    async (status) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          rows([{ id: 'try', name: 'Try Kiibee', price: 0, currency: 'DKK' }]),
        )
        .mockReturnValueOnce(
          rows([
            {
              customPrice: 100,
              paymentPeriod: '1',
              customSubscriptionRevision: 1,
              customSubscriptionStatus: status,
            },
          ]),
        );
      jest.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'creator',
        fullName: 'Test Creator',
        email: 'creator@example.com',
      } as never);
      const saveCheckout = jest.fn().mockResolvedValue(undefined);
      jest.mocked(db.insert).mockReturnValue({ values: saveCheckout } as never);
      mockEpayPost
        .mockResolvedValueOnce({
          data: { billingPlan: { id: 'custom-billing-plan' } },
        })
        .mockResolvedValueOnce({
          data: { paymentWindowUrl: 'https://example.com/payment' },
        });
      await expect(
        createSubscriptionService({
          userId: 'creator',
          planId: 'try',
          billingMonths: 1,
        }),
      ).resolves.toMatchObject({
        success: true,
        data: { paymentWindowUrl: 'https://example.com/payment' },
      });
      expect(mockEpayPost).toHaveBeenNthCalledWith(
        1,
        '/public/api/v1/subscriptions/billing/plans',
        expect.objectContaining({ amount: 10000 }),
        expect.anything(),
      );
      expect(mockEpayPost).toHaveBeenNthCalledWith(
        2,
        '/public/api/v1/cit',
        expect.objectContaining({
          amount: 10000,
          subscription: expect.objectContaining({ amount: 10000 }),
        }),
        expect.anything(),
      );
      expect(saveCheckout).toHaveBeenCalledWith(
        expect.objectContaining({ amountMinor: 10000, customRevision: 1 }),
      );
      expect(db.update).not.toHaveBeenCalled();
      expect(sendTemplateEmail).not.toHaveBeenCalled();
    },
  );
});
