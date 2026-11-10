import {
  PAYMENT_WEBHOOK_PATH,
  SUBSCRIPTION_WEBHOOK_PATH,
  resolveWebhookUrl,
} from 'src/utils/webhookUrl';

describe('resolveWebhookUrl', () => {
  it('appends the webhook path to a base URL', () => {
    expect(
      resolveWebhookUrl('https://server.kiibee.com', PAYMENT_WEBHOOK_PATH),
    ).toBe('https://server.kiibee.com/api/v1/payment/webhook');
  });

  it('does not duplicate an already complete webhook URL', () => {
    expect(
      resolveWebhookUrl(
        'https://server.kiibee.com/api/v1/payment/webhook',
        PAYMENT_WEBHOOK_PATH,
      ),
    ).toBe('https://server.kiibee.com/api/v1/payment/webhook');
  });

  it('collapses an already duplicated webhook URL', () => {
    expect(
      resolveWebhookUrl(
        'https://server.kiibee.com/api/v1/payment/webhook/api/v1/payment/webhook',
        PAYMENT_WEBHOOK_PATH,
      ),
    ).toBe('https://server.kiibee.com/api/v1/payment/webhook');
  });

  it('replaces a different ePay webhook path', () => {
    expect(
      resolveWebhookUrl(
        'https://server.kiibee.com/api/v1/payment/webhook',
        SUBSCRIPTION_WEBHOOK_PATH,
      ),
    ).toBe('https://server.kiibee.com/api/v1/subscription/webhook');
  });

  it('collapses mixed duplicated webhook paths', () => {
    expect(
      resolveWebhookUrl(
        'https://server.kiibee.com/api/v1/payment/webhook/api/v1/subscription/webhook',
        SUBSCRIPTION_WEBHOOK_PATH,
      ),
    ).toBe('https://server.kiibee.com/api/v1/subscription/webhook');
  });

  it('keeps a custom base path', () => {
    expect(
      resolveWebhookUrl(
        'https://example.com/api/webhooks/epay',
        PAYMENT_WEBHOOK_PATH,
      ),
    ).toBe('https://example.com/api/webhooks/epay/api/v1/payment/webhook');
  });

  it('rejects a missing or invalid webhook URL', () => {
    expect(() => resolveWebhookUrl(undefined, PAYMENT_WEBHOOK_PATH)).toThrow(
      'EPAY_WEBHOOK_URL is not configured',
    );
    expect(() => resolveWebhookUrl('not-a-url', PAYMENT_WEBHOOK_PATH)).toThrow(
      'EPAY_WEBHOOK_URL must be an absolute URL',
    );
  });
});
