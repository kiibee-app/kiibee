export const PAYMENT_WEBHOOK_PATH = '/api/v1/payment/webhook';
export const SUBSCRIPTION_WEBHOOK_PATH = '/api/v1/subscription/webhook';
export const PAYOUT_WEBHOOK_PATH = '/api/v1/payout/webhook';

const KNOWN_WEBHOOK_PATHS = [PAYMENT_WEBHOOK_PATH, SUBSCRIPTION_WEBHOOK_PATH];

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

const stripKnownWebhookPaths = (basePath: string) => {
  let result = basePath;
  let changed = true;

  while (changed) {
    changed = false;

    for (const webhookPath of KNOWN_WEBHOOK_PATHS) {
      if (result.endsWith(webhookPath)) {
        result = trimTrailingSlashes(
          result.slice(0, result.length - webhookPath.length),
        );
        changed = true;
      }
    }
  }

  return result;
};

export const resolveWebhookUrl = (
  configuredUrl: string | undefined,
  webhookPath: string,
): string => {
  const value = configuredUrl?.trim();

  if (!value) {
    throw new Error('EPAY_WEBHOOK_URL is not configured');
  }

  const targetPath = trimTrailingSlashes(
    webhookPath.startsWith('/') ? webhookPath : `/${webhookPath}`,
  );

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('EPAY_WEBHOOK_URL must be an absolute URL');
  }

  const basePath = stripKnownWebhookPaths(trimTrailingSlashes(parsed.pathname));

  return `${parsed.origin}${basePath}${targetPath}${parsed.search}`;
};

export const getPaymentWebhookUrl = () =>
  resolveWebhookUrl(process.env.EPAY_WEBHOOK_URL, PAYMENT_WEBHOOK_PATH);

export const getSubscriptionWebhookUrl = () =>
  resolveWebhookUrl(process.env.EPAY_WEBHOOK_URL, SUBSCRIPTION_WEBHOOK_PATH);

export const getPayoutWebhookUrl = () =>
  resolveWebhookUrl(
    process.env.EPAY_PAYOUT_NOTIFICATION_URL ?? process.env.EPAY_WEBHOOK_URL,
    PAYOUT_WEBHOOK_PATH,
  );
