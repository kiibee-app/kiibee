import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from 'src/services/s3.client';

@Injectable()
export class VideoMultipartService {
  async initUpload() {
    const key = `videos/${randomUUID()}.mp4`;

    const res = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: process.env.DO_BUCKET!,
        Key: key,
        ACL: 'private',
      }),
    );

    return {
      uploadId: res.UploadId!,
      key,
    };
  }

  async getPartUrl(key: string, uploadId: string, partNumber: number) {
    const command = new UploadPartCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: key,
      UploadId: uploadId,
      PartNumber: Number(partNumber),
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 600,
    });

    return { url };
  }

  async completeUpload(body: {
    key: string;
    uploadId: string;
    parts: { PartNumber: number; ETag: string }[];
  }) {
    const cleanedParts = body.parts.map((p) => ({
      PartNumber: Number(p.PartNumber),
      ETag: p.ETag.startsWith('"') ? p.ETag : `"${p.ETag}"`,
    }));

    const result = await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: process.env.DO_BUCKET!,
        Key: body.key,
        UploadId: body.uploadId,
        MultipartUpload: {
          Parts: cleanedParts,
        },
      }),
    );

    return {
      key: body.key,
      location: `https://${process.env.DO_BUCKET}.${process.env.DO_REGION}.digitaloceanspaces.com/${body.key}`,
      etag: result.ETag,
      bucket: process.env.DO_BUCKET,
    };
  }
}
