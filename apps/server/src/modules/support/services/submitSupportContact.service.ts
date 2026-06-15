import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { supportContactMessages } from 'src/database/schema/system/supportContactMessages.schema';
import { getEmailTransporter } from 'src/lib/emailTransporter';
import { logger } from 'src/logger/logger';
import { env } from 'src/config/env';
import { success } from 'src/utils/sendResponse';
import { SubmitSupportContactDto } from '../dto/supportContact.dto';

const SUPPORT_INBOX_EMAIL = 'support@kiibee.dk';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const buildSupportEmailHtml = (payload: {
  firstName: string;
  lastName: string | null;
  companyName: string | null;
  phoneNumber: string | null;
  email: string;
  message: string;
}) => {
  const fullName = [payload.firstName, payload.lastName]
    .filter(Boolean)
    .join(' ');

  return `
    <h2>New support contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${
      payload.companyName
        ? `<p><strong>Company:</strong> ${escapeHtml(payload.companyName)}</p>`
        : ''
    }
    ${
      payload.phoneNumber
        ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phoneNumber)}</p>`
        : ''
    }
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replaceAll('\n', '<br />')}</p>
  `;
};

export const submitSupportContactService = async (
  payload: SubmitSupportContactDto,
) => {
  try {
    const firstName = payload.firstName.trim();
    const lastName = payload.lastName?.trim() || null;
    const companyName = payload.companyName?.trim() || null;
    const phoneNumber = payload.phoneNumber?.trim() || null;
    const email = payload.email.trim().toLowerCase();
    const message = payload.message.trim();

    const record = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
      message,
    };

    await db.insert(supportContactMessages).values(record);

    try {
      await getEmailTransporter().sendMail({
        from: `"${env.SENDER_NAME}" <${env.SENDER_EMAIL}>`,
        to: SUPPORT_INBOX_EMAIL,
        replyTo: email,
        subject: `Support request from ${firstName}`,
        html: buildSupportEmailHtml({
          firstName,
          lastName,
          companyName,
          phoneNumber,
          email,
          message,
        }),
      });
    } catch (emailError) {
      logger.error('Failed to send support contact notification email', {
        error: emailError,
        supportContactId: record.id,
      });
    }

    return success(
      null,
      'Support message submitted successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Error submitting support contact message:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to submit support message',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
