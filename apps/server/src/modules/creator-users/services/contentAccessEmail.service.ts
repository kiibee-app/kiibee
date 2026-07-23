import { HttpException, HttpStatus } from '@nestjs/common';
import { env } from 'src/config/env';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { escapeHtml } from 'src/utils/sanitize';
import {
  AccessRequest,
  AccessRequestContent,
} from './contentAccessQuery.service';
import { resetPendingRequest } from './contentAccessData.service';
import { formatUserDisplayName } from '../creator-users.helper';

const sendEmailOrFail = async (
  options: Parameters<typeof sendTemplateEmail>[0],
  message: string,
  onFailure?: () => Promise<unknown>,
) => {
  const sent = await sendTemplateEmail(options);
  if (sent) return;
  await onFailure?.();
  throw new HttpException(message, HttpStatus.BAD_GATEWAY);
};

export const sendCreatorApprovalEmail = ({
  content,
  email,
  viewerName,
  token,
}: {
  content: AccessRequestContent;
  email: string;
  viewerName: string | null;
  token: string;
}) =>
  sendEmailOrFail(
    {
      to: content.creatorEmail,
      subject: mailSubject.CONTENT_ACCESS_APPROVAL,
      templateName: templateName.CONTENT_ACCESS_APPROVAL,
      variables: {
        creatorName: escapeHtml(
          formatUserDisplayName({
            fullName: content.fullName,
            firstName: content.firstName,
            lastName: content.lastName,
            email: content.creatorEmail,
          }),
        ),
        viewerName: escapeHtml(viewerName || email),
        viewerEmail: escapeHtml(email),
        contentTitle: escapeHtml(content.title),
        approvalLink: `${env.FRONTEND_URL}/access-request/approve?token=${encodeURIComponent(token)}`,
      },
    },
    'Failed to send content access approval email',
  );

export const sendViewerAccessEmail = (request: AccessRequest, token: string) =>
  sendEmailOrFail(
    {
      to: request.viewerEmail,
      subject: mailSubject.CONTENT_ACCESS_GRANTED,
      templateName: templateName.CONTENT_ACCESS_GRANTED,
      variables: {
        viewerName: escapeHtml(request.viewerName || request.viewerEmail),
        contentTitle: escapeHtml(request.contentTitle),
        contentLink: `${env.FRONTEND_URL}/content/${encodeURIComponent(request.contentId)}?approvedAccess=${encodeURIComponent(token)}`,
      },
    },
    'Failed to send content access email to viewer',
    () => resetPendingRequest(request.id),
  );
