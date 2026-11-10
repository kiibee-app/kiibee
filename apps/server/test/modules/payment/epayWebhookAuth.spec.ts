import { verifyEpayWebhookAuthorization } from 'src/utils/epayWebhookAuth';

describe('verifyEpayWebhookAuthorization', () => {
  afterEach(() => {
    delete process.env.EPAY_WEBHOOK_AUTHORIZATION;
    delete process.env.JWT_ACCESS_SECRET;
  });

  it('accepts the exact full authorization value configured for ePay', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Basic epay-secret';

    expect(verifyEpayWebhookAuthorization('Basic epay-secret')).toMatchObject({
      authorized: true,
      hasAuthorization: true,
      scheme: 'Basic',
    });
    expect(verifyEpayWebhookAuthorization('Bearer epay-secret')).toMatchObject({
      authorized: false,
      reason: 'mismatch',
    });
  });

  it('rejects requests when ePay authorization is not configured', () => {
    process.env.JWT_ACCESS_SECRET = 'legacy-secret';

    expect(
      verifyEpayWebhookAuthorization('Bearer legacy-secret'),
    ).toMatchObject({
      authorized: false,
      reason: 'missing_config',
    });
  });

  it('rejects missing headers without exposing values', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Bearer epay-secret';

    expect(verifyEpayWebhookAuthorization(undefined)).toEqual({
      authorized: false,
      reason: 'missing_header',
      hasAuthorization: false,
    });
  });

  it('reports only the scheme for mismatched headers', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Bearer epay-secret';

    expect(
      verifyEpayWebhookAuthorization('Basic something-else'),
    ).toMatchObject({
      authorized: false,
      reason: 'mismatch',
      hasAuthorization: true,
      scheme: 'Basic',
    });
  });
});
