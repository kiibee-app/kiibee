import { Injectable } from '@nestjs/common';
import { VideoMultipartService } from './services/videoMultipart.service';
import { VideoStreamService } from './services/videoStream.service';
import { VideoDownloadService } from './services/videoDownload.service';
import { FileUploadService } from './services/fileUpload.service';
import { PublicImageUploadService } from './services/publicImageUpload.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly multipart: VideoMultipartService,
    private readonly stream: VideoStreamService,
    private readonly download: VideoDownloadService,
    public readonly fileUpload: FileUploadService,
    public readonly images: PublicImageUploadService,
  ) {}

  initUpload() {
    return this.multipart.initUpload();
  }

  getPartUrl(key: string, uploadId: string, partNumber: number) {
    return this.multipart.getPartUrl(key, uploadId, partNumber);
  }

  completeUpload(body: any) {
    return this.multipart.completeUpload(body);
  }

  getStreamUrl(key: string) {
    return this.stream.getStreamUrl(key);
  }

  getDownloadUrl(key: string) {
    return this.download.getDownloadUrl(key);
  }

  uploadPublicImage(file: {
    buffer: Buffer;
    mimetype?: string;
    filename?: string;
  }) {
    return this.images.upload(file);
  }
}
