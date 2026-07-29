import { EMAIL_RETRY } from 'src/utils/constant';
import { getEmailTransporter } from './emailTransporter';
import { logger } from 'src/logger/logger';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendEmailWithRetry(mailOptions: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const transporter = getEmailTransporter();

  let lastError: unknown;

  for (let attempt = 1; attempt <= EMAIL_RETRY.MAX_RETRIES; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      lastError = error;

      if (attempt < EMAIL_RETRY.MAX_RETRIES) {
        const delay = EMAIL_RETRY.BASE_DELAY_MS * 2 ** (attempt - 1);

        logger.warn(
          `Email send attempt ${attempt}/${EMAIL_RETRY.MAX_RETRIES} failed, retrying in ${delay}ms`,
          {
            to: mailOptions.to,
            subject: mailOptions.subject,
            error,
          },
        );

        await sleep(delay);
      }
    }
  }

  logger.error('Failed to send email after retries', {
    to: mailOptions.to,
    subject: mailOptions.subject,
    error: lastError,
  });

  return false;
}
