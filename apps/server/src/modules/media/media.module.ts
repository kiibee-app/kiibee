import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { VideoMultipartService } from './services/videoMultipart.service';
import { VideoStreamService } from './services/videoStream.service';
import { VideoDownloadService } from './services/videoDownload.service';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    VideoMultipartService,
    VideoStreamService,
    VideoDownloadService,
  ],
})
export class MediaModule {}
