import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import type { UploadContentType } from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";

export type UploadedMedia = {
  key: string;
  url?: string;
  location?: string;
};

type FileUploadType = "documents" | "audio" | "ebooks";

type FileUploadInitResponse = {
  key: string;
  uploadUrl: string;
  contentType: string;
};

type FileUploadConfirmResponse = {
  key: string;
  url: string;
};

type VideoUploadInitResponse = {
  key: string;
  uploadId: string;
};

type VideoPartUrlResponse = {
  url: string;
};

type VideoCompleteResponse = {
  key: string;
  location: string;
};

export const CONTENT_UPLOAD_ERROR_KEY = {
  emptyFile: "contents.contentUploadModal.errors.emptyFile",
  invalidExtension: "contents.contentUploadModal.errors.invalidExtension",
  invalidFileName: "contents.contentUploadModal.errors.invalidFileName",
  missingVideoEtag: "contents.contentUploadModal.errors.missingVideoEtag",
  uploadFailed: "contents.contentUploadModal.errors.uploadFailed",
} as const;

const VIDEO_CHUNK_SIZE_BYTES = 5 * 1024 * 1024;
const VIDEO_UPLOAD_CONCURRENCY = 4;

const FILE_UPLOAD_TYPE_BY_CONTENT_TYPE: Partial<
  Record<UploadContentType, FileUploadType>
> = {
  audio: "audio",
  pdf: "documents",
  epub: "ebooks",
};

export const isAcceptedUploadFile = (
  file: File,
  extensions: readonly string[],
) =>
  extensions.some((extension) => file.name.toLowerCase().endsWith(extension));

export const getUploadFileError = (
  file: File,
  extensions: readonly string[],
) => {
  if (file.size === 0) return CONTENT_UPLOAD_ERROR_KEY.emptyFile;
  if (!isAcceptedUploadFile(file, extensions)) {
    return CONTENT_UPLOAD_ERROR_KEY.invalidExtension;
  }

  return null;
};

const getFileExtension = (file: File) => {
  const extension = file.name.split(".").pop()?.trim().toLowerCase();

  if (!extension || extension === file.name.toLowerCase()) {
    throw new Error(CONTENT_UPLOAD_ERROR_KEY.invalidFileName);
  }

  return extension;
};

const uploadToSignedUrl = async (
  file: Blob,
  uploadUrl: string,
  contentType?: string,
) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Upload failed:", {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });

    throw new Error(CONTENT_UPLOAD_ERROR_KEY.uploadFailed);
  }

  return response;
};

const uploadRegularFile = async (
  file: File,
  uploadType: UploadContentType,
): Promise<UploadedMedia> => {
  const type = FILE_UPLOAD_TYPE_BY_CONTENT_TYPE[uploadType];

  if (!type) throw new Error(CONTENT_UPLOAD_ERROR_KEY.invalidExtension);

  const { data: init } = await axiosClient.post<FileUploadInitResponse>(
    API.media.fileUploadUrl,
    {
      type,
      extension: getFileExtension(file),
      contentType: file.type,
    },
  );

  await uploadToSignedUrl(file, init.uploadUrl);

  const { data: confirmation } =
    await axiosClient.post<FileUploadConfirmResponse>(API.media.fileConfirm, {
      key: init.key,
    });

  return {
    key: confirmation.key,
    url: confirmation.url,
  };
};

const uploadVideoFile = async (file: File): Promise<UploadedMedia> => {
  const { data: init } = await axiosClient.post<VideoUploadInitResponse>(
    API.media.videoInit,
  );
  const chunks = Array.from(
    { length: Math.ceil(file.size / VIDEO_CHUNK_SIZE_BYTES) },
    (_, index) =>
      file.slice(
        index * VIDEO_CHUNK_SIZE_BYTES,
        (index + 1) * VIDEO_CHUNK_SIZE_BYTES,
      ),
  );
  const parts: { PartNumber: number; ETag: string }[] = [];
  let nextChunkIndex = 0;

  const workers = Array.from(
    { length: Math.min(VIDEO_UPLOAD_CONCURRENCY, chunks.length) },
    async () => {
      while (nextChunkIndex < chunks.length) {
        const currentChunkIndex = nextChunkIndex;
        nextChunkIndex += 1;

        const partNumber = currentChunkIndex + 1;
        const { data: part } = await axiosClient.get<VideoPartUrlResponse>(
          API.media.videoPartUrl,
          {
            params: {
              key: init.key,
              uploadId: init.uploadId,
              partNumber,
            },
          },
        );

        const response = await uploadToSignedUrl(
          chunks[currentChunkIndex],
          part.url,
        );
        const etag = response.headers.get("etag");

        if (!etag) throw new Error(CONTENT_UPLOAD_ERROR_KEY.missingVideoEtag);

        parts.push({ PartNumber: partNumber, ETag: etag });
      }
    },
  );

  await Promise.all(workers);

  const { data: completed } = await axiosClient.post<VideoCompleteResponse>(
    API.media.videoComplete,
    {
      key: init.key,
      uploadId: init.uploadId,
      parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
    },
  );

  return {
    key: completed.key,
    location: completed.location,
  };
};

export const uploadContentMedia = (
  file: File,
  uploadType: UploadContentType,
) =>
  uploadType === FORMAT_TYPE.VIDEO
    ? uploadVideoFile(file)
    : uploadRegularFile(file, uploadType);
