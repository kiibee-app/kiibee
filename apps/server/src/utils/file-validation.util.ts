import { BadRequestException } from '@nestjs/common';
import { fromBuffer } from 'file-type';

export async function validateImageMagicNumber(
  buffer: Buffer,
  allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
) {
  const typeInfo = await fromBuffer(buffer);

  if (!typeInfo || !allowedMimeTypes.includes(typeInfo.mime)) {
    throw new BadRequestException('Invalid image file content');
  }

  return typeInfo;
}
