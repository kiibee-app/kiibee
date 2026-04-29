import nodemailer from 'nodemailer';
import { logger } from 'src/logger/logger';
import { SmtpConfig, smtpEnvSchema } from 'src/validators/smtpEnvSchema';

export const maskSecretForLogs = (value?: string | null): string => {
  if (!value) return '[missing]';

  const normalizedValue = value.trim();

  if (normalizedValue.length <= 2) {
    return '*'.repeat(normalizedValue.length);
  }

  return `${normalizedValue.slice(0, 2)}***${normalizedValue.slice(-2)}`;
};

const getRedactedSmtpMetadata = (env: NodeJS.ProcessEnv) => ({
  host: env.SMTP_HOST?.trim(),
  port: env.SMTP_PORT?.trim(),
  user: maskSecretForLogs(env.SMTP_USER),
  passConfigured: Boolean(env.SMTP_PASS?.trim()),
  credentialSource: 'process.env',
});

export const loadSmtpConfig = (
  env: NodeJS.ProcessEnv = process.env,
): SmtpConfig => {
  const result = smtpEnvSchema.safeParse(env);

  if (!result.success) {
    logger.error('Invalid SMTP configuration', {
      issues: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
      smtp: getRedactedSmtpMetadata(env),
    });

    throw new Error(
      'Invalid SMTP configuration. SMTP credentials were rejected before transporter initialization.',
    );
  }

  if (env.NODE_ENV === 'production') {
    logger.warn(
      'SMTP credentials are being sourced from environment variables in production. Prefer a managed secrets provider.',
    );
  }

  return result.data;
};

let transporter: nodemailer.Transporter | null = null;

export const getEmailTransporter = (): nodemailer.Transporter => {
  if (transporter) {
    return transporter;
  }

  const smtpConfig = loadSmtpConfig();

  transporter = nodemailer.createTransport({
    host: smtpConfig.SMTP_HOST,
    port: smtpConfig.SMTP_PORT,
    secure: smtpConfig.SMTP_PORT === 465,
    auth: {
      user: smtpConfig.SMTP_USER,
      pass: smtpConfig.SMTP_PASS,
    },
  });

  return transporter;
};
