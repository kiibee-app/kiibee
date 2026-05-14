"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTENT_UPLOAD_CONFIG,
  resolveUploadContentType,
  type ContentType,
} from "@/utils/content";

type Params = {
  contentType: ContentType | null;
};

export function useContentUpload({ contentType }: Params) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const uploadType = resolveUploadContentType(contentType);
  const uploadConfig = CONTENT_UPLOAD_CONFIG[uploadType];

  const previewUrl = useMemo(() => {
    if (!selectedFile || uploadType !== "video") return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile, uploadType]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadComplete(false);
  };

  const validateFile = (file: File) => {
    return uploadConfig.extensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );
  };

  const selectFile = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadComplete(true);
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
    if (!file || !validateFile(file)) return;

    selectFile(file);
  };

  const canProceed = Boolean(selectedFile && !isUploading && uploadComplete);

  return {
    // refs
    fileInputRef,

    // state
    selectedFile,
    isUploading,
    uploadComplete,
    previewUrl,

    // derived
    uploadType,
    uploadConfig,
    canProceed,

    // actions
    reset,
    handleFileInputChange,
    handleDrop,
  };
}
