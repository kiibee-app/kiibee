import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckMediaAccessGuard } from 'src/middleware/CheckMediaAccess';

type FileType = 'documents' | 'audio' | 'ebooks';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('videos/init')
  init() {
    return this.mediaService.initUpload();
  }

  @Get('videos/part-url')
  getPartUrl(
    @Query('key') key: string,
    @Query('uploadId') uploadId: string,
    @Query('partNumber', ParseIntPipe) partNumber: number,
  ) {
    return this.mediaService.getPartUrl(key, uploadId, partNumber);
  }

  @Post('videos/complete')
  complete(@Body() body: any) {
    return this.mediaService.completeUpload(body);
  }

  @Get('videos/stream')
  stream(@Query('key') key: string) {
    return this.mediaService.getStreamUrl(key);
  }

  @Get('videos/download')
  download(@Query('key') key: string) {
    return this.mediaService.getDownloadUrl(key);
  }

  @Post('file/upload-url')
  getUploadUrl(
    @Body()
    body: {
      type: FileType;
      extension: string;
      contentType?: string;
    },
  ) {
    const contentType =
      body.contentType ||
      this.mediaService.fileUpload.getMimeType(body.extension);

    return this.mediaService.fileUpload.getUploadUrl({
      type: body.type,
      extension: body.extension,
      contentType,
    });
  }

  @Post('file/confirm')
  async confirmUpload(@Body() body: { key: string }) {
    const url = await this.mediaService.fileUpload.getSignedUrl(body.key);

    return {
      success: true,
      key: body.key,
      url,
    };
  }

  @Get('file/signed-url')
  async getSignedUrl(@Query('key') key: string) {
    return {
      url: await this.mediaService.fileUpload.getSignedUrl(key),
    };
  }

  @Post('images/upload')
  async uploadImage(@Req() req: FastifyRequest) {
    const file = await req.file();
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const buffer = await this.streamToBuffer(file.file);
    return this.mediaService.uploadPublicImage({
      buffer,
      mimetype: file.mimetype,
      filename: file.filename,
    });
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (c) => chunks.push(Buffer.from(c)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('signed-url')
  async getMediaSignedUrl(@Query('key') key: string) {
    return {
      url: await this.mediaService.getMediaSignedUrl(key),
    };
  }
}
