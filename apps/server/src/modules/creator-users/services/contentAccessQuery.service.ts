import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { contentAccessRequests, mediaFiles, users } from 'src/database/schema';
import { hashApprovalToken } from 'src/utils/contentAccess';
import { fail } from 'src/utils/sendResponse';

export const getContentForAccessRequest = async (
  contentId: string,
  creatorId: string,
) => {
  const [content] = await db
    .select({
      title: mediaFiles.title,
      creatorEmail: users.email,
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(mediaFiles)
    .innerJoin(users, eq(users.id, mediaFiles.creatorId))
    .where(
      and(eq(mediaFiles.id, contentId), eq(mediaFiles.creatorId, creatorId)),
    )
    .limit(1);

  return content ?? fail('Content not found', HttpStatus.NOT_FOUND);
};

export type AccessRequestContent = Awaited<
  ReturnType<typeof getContentForAccessRequest>
>;

export const getAccessRequest = async (token: string) => {
  const [request] = await db
    .select({
      id: contentAccessRequests.id,
      creatorId: contentAccessRequests.creatorId,
      status: contentAccessRequests.status,
      expiresAt: contentAccessRequests.expiresAt,
      viewerEmail: contentAccessRequests.viewerEmail,
      viewerName: contentAccessRequests.viewerName,
      contentId: contentAccessRequests.contentId,
      contentTitle: mediaFiles.title,
    })
    .from(contentAccessRequests)
    .innerJoin(mediaFiles, eq(mediaFiles.id, contentAccessRequests.contentId))
    .where(
      eq(contentAccessRequests.approvalTokenHash, hashApprovalToken(token)),
    )
    .limit(1);

  return request ?? fail('Invalid approval link', HttpStatus.NOT_FOUND);
};

export type AccessRequest = Awaited<ReturnType<typeof getAccessRequest>>;
