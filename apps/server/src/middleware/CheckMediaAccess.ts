import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { collectionItems } from 'src/database/schema/content/collectionItems.schema';
import { userContentAccess } from 'src/database/schema/access/userContentAccess.schema';
import { and, eq, or, isNull, gt } from 'drizzle-orm';
import { ACCESS_TYPE } from 'src/utils/constant';

@Injectable()
export class CheckMediaAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    const mediaId =
      request.params?.id ||
      request.params?.mediaId ||
      request.body?.id ||
      request.query?.id;

    const mediaKey =
      request.params?.key || request.query?.key || request.body?.key;

    if (!mediaId && !mediaKey) {
      throw new BadRequestException('Media ID or key is required');
    }

    const whereClause = mediaId
      ? eq(mediaFiles.id, mediaId)
      : eq(mediaFiles.fileKey, mediaKey);

    const mediaFile = await db.query.mediaFiles.findFirst({
      where: whereClause,
      columns: {
        id: true,
        creatorId: true,
        accessType: true,
        isDeleted: true,
      },
    });

    if (!mediaFile) {
      throw new NotFoundException('Media not found');
    }

    if (mediaFile.creatorId === userId) {
      request.mediaFile = mediaFile;
      return true;
    }

    const now = new Date();
    const hasDirectAccess = async () => {
      const rows = await db
        .select()
        .from(userContentAccess)
        .where(
          and(
            eq(userContentAccess.userId, userId),
            eq(userContentAccess.mediaFileId, mediaFile.id),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        )
        .limit(1);
      return rows.length > 0;
    };

    const hasCollectionAccess = async () => {
      const rows = await db
        .select({ id: userContentAccess.id })
        .from(userContentAccess)
        .innerJoin(
          collectionItems,
          eq(collectionItems.collectionId, userContentAccess.collectionId),
        )
        .where(
          and(
            eq(userContentAccess.userId, userId),
            isNull(userContentAccess.mediaFileId),
            eq(collectionItems.mediaFileId, mediaFile.id),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        )
        .limit(1);
      return rows.length > 0;
    };

    if (mediaFile.isDeleted) {
      const hasAccess =
        (await hasDirectAccess()) || (await hasCollectionAccess());
      if (!hasAccess) {
        throw new NotFoundException('Media not found');
      }

      request.mediaFile = mediaFile;
      return true;
    }

    if (mediaFile.accessType === ACCESS_TYPE.FREE) {
      request.mediaFile = mediaFile;
      return true;
    }

    if ((await hasDirectAccess()) || (await hasCollectionAccess())) {
      request.mediaFile = mediaFile;
      return true;
    }

    throw new ForbiddenException(
      'Access denied. You do not have permission to access this media.',
    );
  }
}
