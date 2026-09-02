import { Injectable } from '@nestjs/common';
import { CloudflareStreamService } from './services/videoMultipart.service';
import { VideoStreamService } from './services/videoStream.service';
import { VideoDownloadService } from './services/videoDownload.service';
import { FileUploadService } from './services/fileUpload.service';
import { PublicImageUploadService } from './services/publicImageUpload.service';
import { GetMediaByKeyService } from './services/getmediaByKey.service';
import { LegacyMediaProxyService } from './services/legacyMediaProxy.service';
import type { FastifyReply } from 'fastify';

@Injectable()
export class MediaService {
  constructor(
    private readonly multipart: CloudflareStreamService,
    private readonly stream: VideoStreamService,
    private readonly download: VideoDownloadService,
    public readonly fileUpload: FileUploadService,
    public readonly images: PublicImageUploadService,
    public readonly getMediaByKey: GetMediaByKeyService,
    private readonly legacyMedia: LegacyMediaProxyService,
  ) {}
  createVideoUpload() {
    return this.multipart.createUpload();
  }

  getStreamUrl(videoId: string, options?: { recordView?: boolean }) {
    return this.stream.getStreamUrl(videoId, 3600, options);
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

  getMediaSignedUrl(
    key: string,
    options?: {
      expiresIn?: number;
      contentType?: string;
      disposition?: 'inline' | 'attachment';
      apiBaseUrl?: string;
      recordView?: boolean;
    },
  ) {
    return this.getMediaByKey.getSignedUrl(key, options);
  }

  streamLegacyFile(params: {
    key: string;
    exp: string;
    sig: string;
    reply: FastifyReply;
  }) {
    return this.legacyMedia.stream(params);
  }
}
