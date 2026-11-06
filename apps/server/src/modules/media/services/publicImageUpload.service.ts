import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/services/s3.client';
import { optimizePublicImage } from '../utils/optimizePublicImage';

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

    let image: Buffer;
    try {
      image = await optimizePublicImage(file.buffer);
    } catch {
      throw new BadRequestException('Invalid or unsupported image');
    }
    const key = `images/${randomUUID()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.DO_BUCKET!,
        Key: key,
        Body: image,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
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
}
