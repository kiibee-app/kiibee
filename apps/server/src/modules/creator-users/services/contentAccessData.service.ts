import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { contentAccessRequests, emailSubscribers } from 'src/database/schema';
import { STATUS, Time } from 'src/utils/constant';
import { hashApprovalToken } from 'src/utils/contentAccess';
import { AccessRequest } from './contentAccessQuery.service';

export const savePendingAccessRequest = async ({
  creatorId,
  contentId,
  email,
  viewerName,
  token,
}: {
  creatorId: string;
  contentId: string;
  email: string;
  viewerName: string | null;
  token: string;
}) => {
  const now = new Date();
  const approvalTokenHash = hashApprovalToken(token);
  const expiresAt = new Date(now.getTime() + Time.ONE_WEEK);
  const pendingValues = {
    viewerName,
    approvalTokenHash,
    expiresAt,
    status: STATUS.PENDING,
  };

  await db
    .insert(contentAccessRequests)
    .values({
      id: randomUUID(),
      creatorId,
      contentId,
      viewerEmail: email,
      ...pendingValues,
    })
    .onConflictDoUpdate({
      target: [
        contentAccessRequests.creatorId,
        contentAccessRequests.contentId,
        contentAccessRequests.viewerEmail,
      ],
      set: {
        ...pendingValues,
        approvedAt: null,
        updatedAt: now,
      },
    });
};

export const grantContentAccess = async (request: AccessRequest) => {
  const now = new Date();
  const subscriberValues = {
    name: request.viewerName,
    source: 'content',
    sourceId: request.contentId,
    isActive: true,
  };

  await db.transaction(async (tx) => {
    await tx
      .update(contentAccessRequests)
      .set({ status: STATUS.APPROVED, approvedAt: now, updatedAt: now })
      .where(eq(contentAccessRequests.id, request.id));

    await tx
      .insert(emailSubscribers)
      .values({
        id: randomUUID(),
        creatorId: request.creatorId,
        email: request.viewerEmail,
        ...subscriberValues,
        subscribedAt: now,
      })
      .onConflictDoUpdate({
        target: [emailSubscribers.creatorId, emailSubscribers.email],
        set: {
          ...subscriberValues,
          updatedAt: now,
        },
      });
  });
};

export const resetPendingRequest = (requestId: string) =>
  db
    .update(contentAccessRequests)
    .set({ status: STATUS.PENDING, approvedAt: null, updatedAt: new Date() })
    .where(eq(contentAccessRequests.id, requestId));
