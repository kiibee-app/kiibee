jest.mock('src/modules/payment/hooks/paymentWebhook', () => ({
  handleEpayPayment: jest.fn(),
}));
jest.mock('src/modules/payment/hooks/cardAddedWebhook', () => ({
  handleAddCardWebhook: jest.fn(),
}));

import { HttpStatus } from '@nestjs/common';
import { PaymentController } from 'src/modules/payment/payment.controller';
import { handleEpayPayment } from 'src/modules/payment/hooks/paymentWebhook';
import { handleAddCardWebhook } from 'src/modules/payment/hooks/cardAddedWebhook';

const mockHandleEpayPayment = handleEpayPayment as jest.MockedFunction<
  typeof handleEpayPayment
>;
const mockHandleAddCardWebhook = handleAddCardWebhook as jest.MockedFunction<
  typeof handleAddCardWebhook
>;

describe('PaymentController webhook', () => {
  const controller = new PaymentController({} as any);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Bearer webhook-secret';
  });

  afterEach(() => {
    delete process.env.EPAY_WEBHOOK_AUTHORIZATION;
  });

  it('returns a successful response for a valid ePay callback', async () => {
    mockHandleEpayPayment.mockResolvedValue(undefined);

    await expect(
      controller.handleWebhook(
        { transaction: { id: 'txn-1' } },
        { headers: { authorization: 'Bearer webhook-secret' } },
      ),
    ).resolves.toEqual({ received: true });

    expect(mockHandleEpayPayment).toHaveBeenCalledWith({
      transaction: { id: 'txn-1' },
    });
  });

  it('rejects an unauthenticated callback', async () => {
    await expect(
      controller.handleWebhook(
        { transaction: { id: 'txn-1' } },
        { headers: { authorization: 'Bearer wrong' } },
      ),
    ).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
    });

    expect(mockHandleEpayPayment).not.toHaveBeenCalled();
  });

  it('requires ePay authorization for the card webhook', async () => {
    await expect(
      controller.handleAddCardWebhook(
        { transaction: { id: 'txn-1' } },
        { headers: { authorization: 'Bearer wrong' } },
      ),
    ).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
    });

    expect(mockHandleAddCardWebhook).not.toHaveBeenCalled();
  });
});
