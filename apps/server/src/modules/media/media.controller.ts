import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media/videos')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('init')
  init() {
    return this.mediaService.initUpload();
  }

  @Get('part-url')
  getPartUrl(
    @Query('key') key: string,
    @Query('uploadId') uploadId: string,
    @Query('partNumber') partNumber: number,
  ) {
    return this.mediaService.getPartUrl(key, uploadId, Number(partNumber));
  }

  @Post('complete')
  complete(@Body() body: any) {
    return this.mediaService.completeUpload(body);
  }

  @Get('stream')
  stream(@Query('key') key: string) {
    return this.mediaService.getStreamUrl(key);
  }

  @Get('download')
  download(@Query('key') key: string) {
    return this.mediaService.getDownloadUrl(key);
  }
}
