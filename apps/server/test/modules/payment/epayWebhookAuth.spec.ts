import {
  describeEpayWebhookAuthorization,
  verifyEpayWebhookAuthorization,
} from 'src/utils/epayWebhookAuth';

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

  it('accepts any of multiple configured ePay authorization values', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION =
      'Bearer pos-secret, Bearer partner-secret';

    expect(verifyEpayWebhookAuthorization('Bearer pos-secret')).toMatchObject({
      authorized: true,
      expectedCount: 2,
      expectedLengths: [17, 21],
    });
    expect(
      verifyEpayWebhookAuthorization('Bearer partner-secret'),
    ).toMatchObject({
      authorized: true,
      expectedCount: 2,
      expectedLengths: [17, 21],
    });
    expect(verifyEpayWebhookAuthorization('Bearer other-secret')).toMatchObject(
      {
        authorized: false,
        reason: 'mismatch',
        expectedCount: 2,
      },
    );
  });

  it('reports the received token format without exposing the token', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Bearer expected-secret';

    expect(
      verifyEpayWebhookAuthorization('Bearer header.payload.signature'),
    ).toMatchObject({
      authorized: false,
      reason: 'mismatch',
      receivedFormat: 'jwt',
    });
    expect(
      verifyEpayWebhookAuthorization(
        'Bearer 019eb163-e84f-7d89-bff3-7d5de98551bf',
      ),
    ).toMatchObject({
      authorized: false,
      reason: 'mismatch',
      receivedFormat: 'uuid',
    });
    expect(
      verifyEpayWebhookAuthorization('Bearer opaque-secret'),
    ).toMatchObject({
      authorized: false,
      reason: 'mismatch',
      receivedFormat: 'opaque',
    });
  });

  it('describes configured values without exposing them', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION =
      'Bearer pos-secret, Basic partner-secret';

    expect(describeEpayWebhookAuthorization()).toEqual({
      configured: true,
      count: 2,
      schemes: ['Bearer', 'Basic'],
      lengths: [17, 20],
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

    expect(verifyEpayWebhookAuthorization(undefined)).toMatchObject({
      authorized: false,
      reason: 'missing_header',
      hasAuthorization: false,
      expectedScheme: 'Bearer',
      expectedCount: 1,
    });
  });

  it('treats the auth scheme case-insensitively', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Bearer epay-secret';

    expect(verifyEpayWebhookAuthorization('bearer epay-secret')).toMatchObject({
      authorized: true,
      hasAuthorization: true,
      scheme: 'bearer',
    });
  });

  it('accepts an env value wrapped in matching quotes', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = '"Bearer epay-secret"';

    expect(verifyEpayWebhookAuthorization('Bearer epay-secret')).toMatchObject({
      authorized: true,
      hasAuthorization: true,
    });
  });

  it('ignores outer whitespace and repeated separator whitespace', () => {
    process.env.EPAY_WEBHOOK_AUTHORIZATION = 'Bearer epay-secret';

    expect(
      verifyEpayWebhookAuthorization('  Bearer   epay-secret  '),
    ).toMatchObject({
      authorized: true,
      hasAuthorization: true,
      receivedHasOuterWhitespace: true,
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
