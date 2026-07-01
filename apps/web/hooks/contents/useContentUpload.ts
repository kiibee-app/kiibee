"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  CONTENT_UPLOAD_CONFIG,
  MEDIA_UPLOAD_FILE_TYPE_MAP,
  POST_METHOD,
  resolveUploadContentType,
  type ContentType,
  type UploadContentType,
} from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";
import { toast } from "react-toastify";
import axios from "axios";
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
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

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
    try {
      const { data: init } = await axiosClient.post<{
        uid: string;
        uploadURL: string;
      }>(API.media.videoUpload);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(init.uploadURL, {
        method: POST_METHOD,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

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

      toast.error(message);
      throw error;
    }
  };

  const uploadFile = async (
    file: File,
    type: Exclude<UploadContentType, typeof FORMAT_TYPE.VIDEO>,
  ): Promise<UploadedFile> => {
    try {
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
    } catch (error) {
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
    } catch (error) {
      logger.error("[useContentUpload] Upload failed:", error);
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
