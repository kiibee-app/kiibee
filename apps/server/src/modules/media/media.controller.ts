import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MediaService } from './media.service';

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
}
