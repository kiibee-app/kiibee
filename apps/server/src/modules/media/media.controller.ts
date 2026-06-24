import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckMediaAccessGuard } from 'src/middleware/CheckMediaAccess';
import { CheckPlanLimit } from 'src/middleware/checkPlanLimit';
import { CreatorGuard } from '../auth/guards/admin.guard';

type FileType = 'documents' | 'audio' | 'ebooks';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard, CheckPlanLimit)
  @Post('videos/upload')
  createVideoUpload() {
    return this.mediaService.createVideoUpload();
  }

  @Get('videos/playback')
  getPlayback(@Query('uid') uid: string) {
    return this.mediaService.getStreamUrl(uid);
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('videos/stream')
  stream(@Query('key') key: string) {
    return this.mediaService.getStreamUrl(key);
  }

  @Get('videos/download')
  download(@Query('key') key: string) {
    return this.mediaService.getDownloadUrl(key);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard, CheckPlanLimit)
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

  @UseGuards(JwtAuthGuard, CreatorGuard, CheckPlanLimit)
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
    if (req.isMultipart()) {
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

    const body = req.body as { image?: string };
    if (!body || !body.image) {
      throw new BadRequestException('No image provided');
    }

    const match = body.image.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new BadRequestException('Invalid image format');
    }

    const mimetype = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = mimetype.split('/')[1] || 'png';

    return this.mediaService.uploadPublicImage({
      buffer,
      mimetype,
      filename: `avatar.${ext}`,
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
