import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckMediaAccessGuard } from 'src/middleware/CheckMediaAccess';
import { CheckPlanLimit } from 'src/middleware/checkPlanLimit';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { validateImageMagicNumber } from '../../utils/file-validation.util';
import {
  recordRentalStream,
  getRentalStreamInfo,
} from './services/rentalStreamLimit';
import { ROLE } from 'src/utils/constant';

type FileType = 'documents' | 'audio' | 'ebooks';

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function apiBaseFromRequest(req: FastifyRequest): string {
  const proto =
    firstHeader(req.headers['x-forwarded-proto']) || req.protocol || 'http';
  const host =
    firstHeader(req.headers['x-forwarded-host']) ||
    req.headers.host ||
    'localhost:4001';

  return `${proto}://${host}/api/v1`;
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard, CheckPlanLimit)
  @Post('videos/upload')
  createVideoUpload() {
    return this.mediaService.createVideoUpload();
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('videos/playback')
  async getPlayback(@Query('uid') uid: string, @Req() req: any) {
    const result = await this.mediaService.getStreamUrl(uid);
    await recordRentalStream(req.user.userId, uid, req.user.role);
    return result;
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('videos/stream')
  async stream(@Query('key') key: string, @Req() req: FastifyRequest) {
    const role = (req as FastifyRequest & { user?: { role?: string } }).user
      ?.role;
    const result = await this.mediaService.getStreamUrl(key, {
      recordView: role !== ROLE.ADMIN,
    });
    await recordRentalStream((req as any).user.userId, key, role);
    return result;
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('rental-stream-info')
  async rentalStreamInfo(
    @Query('contentId') contentId: string,
    @Req() req: any,
  ) {
    return { data: await getRentalStreamInfo(req.user.userId, contentId) };
  }

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Post('rental-stream')
  async recordDocumentSession(
    @Body('contentId') contentId: string,
    @Req() req: any,
  ) {
    await recordRentalStream(req.user.userId, contentId, req.user.role);
    return { data: await getRentalStreamInfo(req.user.userId, contentId) };
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

  @UseGuards(JwtAuthGuard, CheckMediaAccessGuard)
  @Get('file/signed-url')
  async getSignedUrl(@Query('key') key: string, @Req() req: FastifyRequest) {
    const url = await this.mediaService.fileUpload.getSignedUrl(
      key,
      apiBaseFromRequest(req),
    );
    if (!/\.(pdf|epub)(?:\?|$)/i.test(key)) {
      await recordRentalStream(
        (req as any).user.userId,
        key,
        (req as any).user.role,
      );
    }
    return { url };
  }

  @Get('legacy-file')
  streamLegacyFile(
    @Query('key') key: string,
    @Query('exp') exp: string,
    @Query('sig') sig: string,
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    return this.mediaService.streamLegacyFile({
      key,
      exp,
      sig,
      reply,
      range: firstHeader(req.headers.range),
      ifRange: firstHeader(req.headers['if-range']),
    });
  }

  @Post('images/upload')
  async uploadImage(@Req() req: FastifyRequest) {
    if (req.isMultipart()) {
      const file = await req.file();
      if (!file) {
        throw new BadRequestException('No image file provided');
      }

      const buffer = await this.streamToBuffer(file.file);

      const typeInfo = await validateImageMagicNumber(buffer);

      return this.mediaService.uploadPublicImage({
        buffer,
        mimetype: typeInfo.mime,
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
  async getMediaSignedUrl(
    @Query('key') key: string,
    @Req() req: FastifyRequest,
  ) {
    const role = (req as FastifyRequest & { user?: { role?: string } }).user
      ?.role;

    return {
      url: await this.mediaService.getMediaSignedUrl(key, {
        apiBaseUrl: apiBaseFromRequest(req),
        recordView: role !== ROLE.ADMIN,
      }),
    };
  }
}
