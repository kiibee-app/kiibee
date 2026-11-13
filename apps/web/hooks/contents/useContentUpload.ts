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
import { toast } from "react-toastify";
import axios from "axios";
import { uploadFileWithProgress } from "@/utils/fileUpload";
import { uploadVideoWithTus } from "@/utils/videoUpload";
import { logger } from "@/lib/logger";

type Params = {
  contentType: ContentType | null;
};

type UploadedFile = {
  key: string;
  url?: string;
  location?: string;
  contentType?: string;
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

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024 * 1024;
const MAX_VIDEO_UPLOAD_SIZE = 3 * 1024 * 1024 * 1024;

const getExtension = (file: File) =>
  file.name.split(".").pop()?.toLowerCase() ?? "";

export function useContentUpload({ contentType }: Params) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUpload = useRef<{
    controller: AbortController;
  } | null>(null);
  useEffect(
    () => () => {
      activeUpload.current?.controller.abort();
      activeUpload.current = null;
    },
    [],
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadType = resolveUploadContentType(contentType);
  const uploadConfig = CONTENT_UPLOAD_CONFIG[uploadType];

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = () => {
    activeUpload.current?.controller.abort();
    activeUpload.current = null;
    setSelectedFile(null);
    setUploadedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploadError(null);
  };

  const validateFile = (file: File) => {
    const validExtension = uploadConfig.extensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    return (
      validExtension &&
      file.size > 0 &&
      file.size <=
        (uploadType === FORMAT_TYPE.VIDEO
          ? MAX_VIDEO_UPLOAD_SIZE
          : MAX_UPLOAD_SIZE)
    );
  };

  const uploadVideo = async (
    file: File,
    operation: { controller: AbortController },
  ): Promise<UploadedFile> => {
    try {
      const { data: init } = await axiosClient.post<{
        uid: string;
        uploadURL: string;
      }>(
        API.media.videoUpload,
        { fileSize: file.size },
        { signal: operation.controller.signal },
      );

      await uploadVideoWithTus(
        file,
        init.uploadURL,
        operation.controller.signal,
        setUploadProgress,
      );

      return {
        key: init.uid,
        contentType: file.type || "video/mp4",
      };
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : "Something went wrong.";

      if (!operation.controller.signal.aborted) toast.error(message);
      throw error;
    }
  };

  const uploadFile = async (
    file: File,
    type: Exclude<UploadContentType, typeof FORMAT_TYPE.VIDEO>,
    operation: { controller: AbortController },
  ): Promise<UploadedFile> => {
    try {
      const { data: upload } = await axiosClient.post<FileUploadUrlResponse>(
        API.media.fileUploadUrl,
        {
          type: MEDIA_UPLOAD_FILE_TYPE_MAP[type],
          extension: getExtension(file),
          contentType: file.type,
        },
        { signal: operation.controller.signal },
      );

      await uploadFileWithProgress(
        upload.uploadUrl,
        file,
        upload.contentType,
        operation.controller.signal,
        setUploadProgress,
      );

      const { data: confirmed } = await axiosClient.post<FileConfirmResponse>(
        API.media.fileConfirm,
        { key: upload.key },
        { signal: operation.controller.signal },
      );
      setUploadProgress(100);

      return {
        key: confirmed.key,
        url: confirmed.url,
        contentType: upload.contentType,
      };
    } catch (error) {
      if (!operation.controller.signal.aborted)
        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message
            : error instanceof Error
              ? error.message
              : "Upload failed.",
        );

      throw error;
    }
  };

  const uploadSelectedFile = (
    file: File,
    operation: { controller: AbortController },
  ) => {
    if (uploadType === FORMAT_TYPE.VIDEO) {
      return uploadVideo(file, operation);
    }

    return uploadFile(
      file,
      uploadType as Exclude<UploadContentType, typeof FORMAT_TYPE.VIDEO>,
      operation,
    );
  };

  const selectFile = async (file: File | null) => {
    if (!file) return;

    if (!validateFile(file)) {
      setUploadError(
        t(
          uploadType === FORMAT_TYPE.VIDEO
            ? "contents.contentUploadModal.invalidVideoFile"
            : "contents.contentUploadModal.invalidFile",
        ),
      );
      return;
    }

    activeUpload.current?.controller.abort();
    const operation = { controller: new AbortController() };
    activeUpload.current = operation;
    setSelectedFile(file);
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadSelectedFile(file, operation);
      if (activeUpload.current !== operation) return;
      setUploadedFile(uploaded);
      setUploadComplete(true);
    } catch (error) {
      if (activeUpload.current !== operation) return;
      logger.error("[useContentUpload] Upload failed:", error);
      setSelectedFile(null);
      setUploadedFile(null);
      setUploadProgress(0);
      setUploadComplete(false);
      setUploadError(t("contents.contentUploadModal.uploadError"));
    } finally {
      if (activeUpload.current === operation) {
        activeUpload.current = null;
        setIsUploading(false);
      }
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
    uploadProgress,
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
