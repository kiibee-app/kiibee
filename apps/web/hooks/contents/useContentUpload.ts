"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTENT_UPLOAD_CONFIG,
  resolveUploadContentType,
  type ContentType,
} from "@/utils/content";
import {
  CONTENT_UPLOAD_ERROR_KEY,
  getUploadFileError,
  uploadContentMedia,
  type UploadedMedia,
} from "@/utils/contentUpload";
import { FORMAT_TYPE } from "@/utils/types";

type Params = {
  contentType: ContentType | null;
};

export function useContentUpload({ contentType }: Params) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadRunIdRef = useRef(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(
    null,
  );
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
    uploadRunIdRef.current += 1;
    setSelectedFile(null);
    setIsUploading(false);
    setUploadComplete(false);
    setUploadError(null);
    setUploadedMedia(null);
  };

  const uploadSelectedFile = async (file: File) => {
    const runId = uploadRunIdRef.current + 1;
    uploadRunIdRef.current = runId;

    setIsUploading(true);
    setUploadComplete(false);
    setUploadError(null);
    setUploadedMedia(null);

    try {
      const media = await uploadContentMedia(file, uploadType);

      if (uploadRunIdRef.current !== runId) return;

      setUploadedMedia(media);
      setUploadComplete(true);
    } catch (error) {
      if (uploadRunIdRef.current !== runId) return;

      setSelectedFile(null);
      setUploadError(
        error instanceof Error
          ? error.message
          : CONTENT_UPLOAD_ERROR_KEY.uploadFailed,
      );
    } finally {
      if (uploadRunIdRef.current === runId) {
        setIsUploading(false);
      }
    }
  };

  const selectFile = (file: File | null) => {
    if (!file) return;

    const error = getUploadFileError(file, uploadConfig.extensions);
    if (error) {
      setUploadError(error);
      return;
    }

    setSelectedFile(file);
    void uploadSelectedFile(file);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    selectFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    selectFile(file);
  };

  const canProceed = Boolean(
    selectedFile && !isUploading && uploadComplete && uploadedMedia?.key,
  );

  return {
    fileInputRef,
    selectedFile,
    isUploading,
    uploadComplete,
    uploadError,
    uploadedMedia,
    previewUrl,
    uploadType,
    uploadConfig,
    canProceed,
    reset,
    handleFileInputChange,
    handleDrop,
  };
}
