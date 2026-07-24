import { HttpException, HttpStatus } from '@nestjs/common';
import { STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import {
  grantContentAccess,
  savePendingAccessRequest,
} from './contentAccessData.service';
import {
  getAccessRequest,
  getContentForAccessRequest,
} from './contentAccessQuery.service';
import {
  sendCreatorApprovalEmail,
  sendViewerAccessEmail,
} from './contentAccessEmail.service';
import {
  createApprovalToken,
  normalizeAccessRequest,
} from 'src/utils/contentAccess';
import { RequestContentAccessDto } from '../dto/contentAccess.dto';

export const requestContentAccessService = async (
  dto: RequestContentAccessDto,
) => {
  const { email, viewerName } = normalizeAccessRequest(dto);
  const token = createApprovalToken();
  const content = await getContentForAccessRequest(
    dto.contentId,
    dto.creatorId,
  );

  await savePendingAccessRequest({
    creatorId: dto.creatorId,
    contentId: dto.contentId,
    email,
    viewerName,
    token,
  });
  await sendCreatorApprovalEmail({ content, email, viewerName, token });

  return success(
    { status: STATUS.PENDING },
    'Content access request sent successfully',
    HttpStatus.ACCEPTED,
  );
};

export const approveContentAccessService = async (token: string) => {
  const request = await getAccessRequest(token);

  if (request.status === STATUS.APPROVED) {
    return success(
      { status: STATUS.APPROVED },
      'Content access request already approved',
      HttpStatus.OK,
    );
  }

  if (request.expiresAt.getTime() < Date.now()) {
    throw new HttpException(
      'Content access request has expired',
      HttpStatus.GONE,
    );
  }
  await grantContentAccess(request);
  await sendViewerAccessEmail(request, token);

  return success(
    { status: STATUS.APPROVED },
    'Content access approved successfully',
    HttpStatus.OK,
  );
};
