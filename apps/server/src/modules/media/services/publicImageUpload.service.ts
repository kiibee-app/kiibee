import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/services/s3.client';

@Injectable()
export class PublicImageUploadService {
  private readonly allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  async upload(file: { buffer: Buffer; mimetype?: string; filename?: string }) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Image file is required');
    }

    const ext = this.getExt(file.filename || '');
    if (!this.allowed.includes(ext)) {
      throw new BadRequestException('Unsupported image format');
    }

    const key = `images/${randomUUID()}.${ext}`;
    const contentType = file.mimetype || this.getContentType(ext);

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.DO_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: contentType,
        ACL: 'public-read',
      }),
    );

    const url = `https://${process.env.DO_BUCKET}.${process.env.DO_REGION}.digitaloceanspaces.com/${key}`;
    return { url, key };
  }

  private getExt(name: string) {
    const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
    return m ? m[1] : '';
  }

  private getContentType(ext: string) {
    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    return map[ext] || 'application/octet-stream';
  }
}
