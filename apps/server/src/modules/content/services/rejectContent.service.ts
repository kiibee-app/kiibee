import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { escapeHtml } from 'src/utils/sanitize';

export const rejectContentService = async (
  contentId: string,
  reason: string,
) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const trimmedReason = reason?.trim();
    if (!trimmedReason) {
      return fail('Rejection reason is required', HttpStatus.BAD_REQUEST);
    }

    const result = await db.transaction(async (trx) => {
      const [existing] = await trx
        .select({
          id: mediaFiles.id,
          title: mediaFiles.title,
          creatorEmail: users.email,
          creatorFirstName: users.firstName,
          creatorFullName: users.fullName,
        })
        .from(mediaFiles)
        .innerJoin(users, eq(mediaFiles.creatorId, users.id))
        .where(
          and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)),
        )
        .limit(1);

      if (!existing) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      await trx.delete(mediaFiles).where(eq(mediaFiles.id, contentId));

      return existing;
    });

    if (result.creatorEmail) {
      runInBackground(
        sendTemplateEmail({
          to: result.creatorEmail,
          subject: mailSubject.REJECTED_CONTENT,
          templateName: templateName.REJECTED_CONTENT,
          variables: {
            name: escapeHtml(
              result.creatorFirstName || result.creatorFullName || 'there',
            ),
            contentTitle: escapeHtml(result.title),
            reason: escapeHtml(trimmedReason).replaceAll('\n', '<br />'),
          },
        }),
        { name: 'rejectContentEmail' },
      );
    }

    return success(
      { id: result.id },
      'Content rejected and deleted successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to reject content:', error);

    if (error instanceof HttpException) throw error;

    return fail('Failed to reject content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
