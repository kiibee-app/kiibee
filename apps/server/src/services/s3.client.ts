import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: process.env.DO_REGION!,
  endpoint: `https://${process.env.DO_REGION}.digitaloceanspaces.com`,

  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SECRET_KEY!,
  },
});
