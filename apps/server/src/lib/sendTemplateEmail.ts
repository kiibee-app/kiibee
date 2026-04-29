import fs from 'fs';
import path from 'path';
import { getEmailTransporter } from './emailTransporter';
import { logger } from 'src/logger/logger';
import { renderTemplate } from './renderTemplate';

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  variables?: Record<string, any>;
}

export async function sendTemplateEmail({
  to,
  subject,
  templateName,
  variables = {},
}: SendEmailOptions): Promise<boolean> {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      `${templateName}.html`,
    );
    const template = await fs.promises.readFile(templatePath, 'utf8');

    const htmlContent = renderTemplate(template, variables);

    await getEmailTransporter().sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    logger.error('Failed to send email:', error);
    return false;
  }
}
