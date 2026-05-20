"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  CONTENT_UPLOAD_CONFIG,
  MEDIA_UPLOAD_FILE_TYPE_MAP,
  resolveUploadContentType,
  type ContentType,
  type UploadContentType,
} from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";

type Params = {
  contentType: ContentType | null;
};

type UploadedFile = {
  key: string;
  url?: string;
  location?: string;
  contentType?: string;
};

type VideoInitResponse = {
  uploadId: string;
  key: string;
};

type VideoPartUrlResponse = {
  url: string;
};

type VideoCompleteResponse = {
  key: string;
  location: string;
};

type FileUploadUrlResponse = {
  key: string;
  uploadUrl: string;
  contentType: string;
};

type FileConfirmResponse = {
  key: string;
  url: string;
};

const VIDEO_PART_SIZE = 10 * 1024 * 1024;
const MAX_UPLOAD_SIZE = 2 * 1024 * 1024 * 1024;

const getExtension = (file: File) =>
  file.name.split(".").pop()?.toLowerCase() ?? "";

const putSignedFile = async (url: string, body: Blob, contentType?: string) => {
  const response = await fetch(url, {
    method: "PUT",
    body,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response;
};

export function useContentUpload({ contentType }: Params) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadType = resolveUploadContentType(contentType);
  const uploadConfig = CONTENT_UPLOAD_CONFIG[uploadType];

  const previewUrl = useMemo(() => {
    if (!selectedFile || uploadType !== FORMAT_TYPE.VIDEO) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile, uploadType]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setIsUploading(false);
    setUploadComplete(false);
    setUploadError(null);
  };

  const validateFile = (file: File) => {
    const validExtension = uploadConfig.extensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    return validExtension && file.size > 0 && file.size <= MAX_UPLOAD_SIZE;
  };

  const uploadVideo = async (file: File): Promise<UploadedFile> => {
    const { data: init } = await axiosClient.post<VideoInitResponse>(
      API.media.videoInit,
    );
    const parts: { PartNumber: number; ETag: string }[] = [];
    const totalParts = Math.ceil(file.size / VIDEO_PART_SIZE);

    for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
      const start = (partNumber - 1) * VIDEO_PART_SIZE;
      const end = Math.min(start + VIDEO_PART_SIZE, file.size);
      const chunk = file.slice(start, end, file.type || "video/mp4");

      const { data } = await axiosClient.get<VideoPartUrlResponse>(
        API.media.videoPartUrl,
        {
          params: {
            key: init.key,
            uploadId: init.uploadId,
            partNumber,
          },
        },
      );

      const response = await putSignedFile(data.url, chunk);
      const etag = response.headers.get("ETag") ?? response.headers.get("etag");

      if (!etag) {
        throw new Error("Upload ETag missing");
      }

      parts.push({ PartNumber: partNumber, ETag: etag });
    }

    const { data: completed } = await axiosClient.post<VideoCompleteResponse>(
      API.media.videoComplete,
      {
        key: init.key,
        uploadId: init.uploadId,
        parts,
      },
    );

    return {
      key: completed.key,
      location: completed.location,
      contentType: file.type || "video/mp4",
    };
  };

  const uploadFile = async (
    file: File,
    type: Exclude<UploadContentType, typeof FORMAT_TYPE.VIDEO>,
  ): Promise<UploadedFile> => {
    const { data: upload } = await axiosClient.post<FileUploadUrlResponse>(
      API.media.fileUploadUrl,
      {
        type: MEDIA_UPLOAD_FILE_TYPE_MAP[type],
        extension: getExtension(file),
        contentType: file.type,
      },
    );

    await putSignedFile(upload.uploadUrl, file, upload.contentType);

    const { data: confirmed } = await axiosClient.post<FileConfirmResponse>(
      API.media.fileConfirm,
      { key: upload.key },
    );

    return {
      key: confirmed.key,
      url: confirmed.url,
      contentType: upload.contentType,
    };
  };

  const uploadSelectedFile = (file: File) => {
    if (uploadType === FORMAT_TYPE.VIDEO) {
      return uploadVideo(file);
    }

    return uploadFile(
      file,
      uploadType as Exclude<UploadContentType, typeof FORMAT_TYPE.VIDEO>,
    );
  };

  const selectFile = async (file: File | null) => {
    if (!file) return;

    if (!validateFile(file)) {
      setUploadError(t("contents.contentUploadModal.invalidFile"));
      return;
    }

    setSelectedFile(file);
    setUploadedFile(null);
    setUploadComplete(false);
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadSelectedFile(file);
      setUploadedFile(uploaded);
      setUploadComplete(true);
    } catch {
      setSelectedFile(null);
      setUploadedFile(null);
      setUploadComplete(false);
      setUploadError(t("contents.contentUploadModal.uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    void selectFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    void selectFile(file);
  };

  const canProceed = Boolean(
    selectedFile && uploadedFile && !isUploading && uploadComplete,
  );

  return {
    fileInputRef,
    selectedFile,
    uploadedFile,
    isUploading,
    uploadComplete,
    uploadError,
    previewUrl,
    uploadType,
    uploadConfig,
    canProceed,
    reset,
    handleFileInputChange,
    handleDrop,
  };
}
