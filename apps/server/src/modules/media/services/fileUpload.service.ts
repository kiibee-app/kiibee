import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3 } from 'src/services/s3.client';

import { ResolveImportedMediaUrlService } from './resolveImportedMediaUrl.service';
import { insertContentViewService } from 'src/modules/creator-overview/services/insertContentView.service';
import { mediaFiles } from 'src/database/schema';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from 'src/database/db';

type FileType = 'documents' | 'audio' | 'ebooks';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly resolveImportedMediaUrl: ResolveImportedMediaUrlService,
  ) {}
  private readonly allowedExtensions: Record<FileType, string[]> = {
    documents: ['pdf'],
    ebooks: ['epub'],
    audio: ['mp3', 'wav', 'ogg'],
  };

  private readonly mimeMap: Record<string, string> = {
    pdf: 'application/pdf',
    epub: 'application/epub+zip',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
  };

  async getUploadUrl(params: {
    type: FileType;
    extension: string;
    contentType?: string;
  }) {
    const extension = params.extension.toLowerCase();

    if (!this.allowedExtensions[params.type]?.includes(extension)) {
      throw new BadRequestException(
        `Invalid file extension for ${params.type}`,
      );
    }

    const contentType = params.contentType || this.getMimeType(extension);

    const key = `${params.type}/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: key,
      ContentType: contentType,
      ACL: 'private',
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 1800,
    });

    return {
      key,
      uploadUrl,
      contentType,
    };
  }

  async getSignedUrl(key: string) {
    const externalUrl = await this.resolveImportedMediaUrl.findExternalUrl(key);
    const [mediaInfo] = await db
      .select({
        creatorId: mediaFiles.creatorId,
        mediaFileId: mediaFiles.id,
      })
      .from(mediaFiles)
      .where(eq(mediaFiles.fileKey, key));

    await insertContentViewService(
      mediaInfo.creatorId,
      mediaInfo.mediaFileId,
      null,
    );

    if (externalUrl) {
      return externalUrl;
    }

    const command = new GetObjectCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: key,
    });

    return await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
  }

  getMimeType(extension: string) {
    return this.mimeMap[extension.toLowerCase()] || 'application/octet-stream';
  }
}
