jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));
jest.mock('src/logger/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));

import axios from 'axios';
import { createPayment } from 'src/modules/payment/services/createPayment.service';

const mockPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe('createPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EPAY_API_KEY = 'api-key';
    process.env.EPAY_BASE_URL = 'https://payments.epay.eu';
    process.env.EPAY_POINT_OF_SALE_ID = 'pos-id';
    process.env.EPAY_WEBHOOK_URL =
      'https://server.kiibee.com/api/v1/payment/webhook';
    process.env.FRONTEND_URL = 'https://server.kiibee.com';
    mockPost.mockResolvedValue({
      data: { paymentWindowUrl: 'https://pay.example/session' },
    } as any);
  });

  it('reuses the same provider idempotency key for duplicate checkout requests', async () => {
    await createPayment({
      orderId: 'order-1',
      amount: 9900,
      currency: 'DKK',
      customerId: 'user-1',
    });
    await createPayment({
      orderId: 'order-1',
      amount: 9900,
      currency: 'DKK',
      customerId: 'user-1',
    });

    const firstConfig = mockPost.mock.calls[0][2] as any;
    const secondConfig = mockPost.mock.calls[1][2] as any;

    expect(firstConfig.headers['Idempotency-Key']).toBe('payment-order-1');
    expect(secondConfig.headers['Idempotency-Key']).toBe('payment-order-1');
    expect(mockPost.mock.calls[0][1]).toMatchObject({
      reference: 'order-1',
      notificationUrl: 'https://server.kiibee.com/api/v1/payment/webhook',
    });
  });

  it('uses different idempotency keys for separate legitimate orders', async () => {
    await createPayment({
      orderId: 'order-1',
      amount: 9900,
      currency: 'DKK',
      customerId: 'user-1',
      subscriptionId: 'card-1',
    });
    await createPayment({
      orderId: 'order-2',
      amount: 9900,
      currency: 'DKK',
      customerId: 'user-1',
      subscriptionId: 'card-1',
    });

    const firstConfig = mockPost.mock.calls[0][2] as any;
    const secondConfig = mockPost.mock.calls[1][2] as any;

    expect(firstConfig.headers['Idempotency-Key']).toBe('payment-order-1');
    expect(secondConfig.headers['Idempotency-Key']).toBe('payment-order-2');
  });
});
