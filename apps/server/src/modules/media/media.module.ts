import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { VideoMultipartService } from './services/videoMultipart.service';
import { VideoStreamService } from './services/videoStream.service';
import { VideoDownloadService } from './services/videoDownload.service';
import { FileUploadService } from './services/fileUpload.service';
import { PublicImageUploadService } from './services/publicImageUpload.service';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    VideoMultipartService,
    VideoStreamService,
    VideoDownloadService,
    FileUploadService,
    PublicImageUploadService,
  ],
})
export class MediaModule {}
