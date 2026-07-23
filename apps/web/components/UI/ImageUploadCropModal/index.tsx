"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  PhotoModalBody,
  UploadDropZone,
  UploadHint,
  UploadOrText,
  CropCanvas,
  ImagePreviewWrapper,
  ImagePreview,
  CropOverlay,
  ZoomContainer,
  ZoomSlider,
  ModalActions,
  HiddenInput,
  UploadNoteText,
  ChangePhotoHint,
  UploadErrorText,
  BlurredBackground,
} from "./styles";
import { GenericModal } from "@/components/UI/Modals";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import {
  CROP_SHAPE,
  CropShapeType,
  DEFAULT_CROP_SIZE,
  DRAG_CLICK_THRESHOLD_PX,
  IMAGE_FILE_ACCEPT,
  IMAGE_MODAL,
  ImageModalStep,
  IMAGE_ZOOM,
  MODAL_ALIGN,
  PREVIEW_FRAME_SIZE,
  MAX_IMAGE_SIZE,
} from "@/utils/ui";
import { getCroppedImg, readFileAsDataUrl, useImageDrag } from "@/utils/image";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  titleUpload: string;
  titleEdit: string;
  image: string | null;
  onClose: () => void;
  onApply: (cropped: string) => void;
  shape?: CropShapeType;
  cropWidth?: number;
  cropHeight?: number;
  recommendedText?: boolean;
  maxSize?: number;
  onImageSelected?: (imageDataUrl: string) => void;
  uploadAsIs?: boolean;
};

const loadImageDimensions = (imageDataUrl: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });

export default function ImageUploadCropModal({
  visible,
  titleUpload,
  titleEdit,
  image,
  onClose,
  onApply,
  shape = CROP_SHAPE.CIRCLE,
  cropWidth = DEFAULT_CROP_SIZE,
  cropHeight = DEFAULT_CROP_SIZE,
  recommendedText = false,
  maxSize = MAX_IMAGE_SIZE,
  onImageSelected,
  uploadAsIs = false,
}: Props) {
  const { t } = useTranslation();
  const [pendingImage, setPendingImage] = useState<string | null>(image);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (visible) {
      const handle = requestAnimationFrame(() => {
        setPendingImage(image);
        setNaturalSize({ width: 0, height: 0 });
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [visible, image]);
  const [frameSize, setFrameSize] = useState({
    width: PREVIEW_FRAME_SIZE,
    height: PREVIEW_FRAME_SIZE,
  });
  const [zoom, setZoom] = useState(IMAGE_ZOOM.DEFAULT);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);

  const frameW = frameSize.width;
  const frameH = frameSize.height;
  const effectiveFrameW = Math.max(1, frameW);
  const effectiveFrameH = Math.max(1, frameH);
  const rawCoverScale =
    naturalSize.width > 0 && naturalSize.height > 0
      ? uploadAsIs
        ? Math.min(
            effectiveFrameW / naturalSize.width,
            effectiveFrameH / naturalSize.height,
          )
        : Math.max(
            effectiveFrameW / naturalSize.width,
            effectiveFrameH / naturalSize.height,
          )
      : 1;

  const coverScale = rawCoverScale;
  const displayW = naturalSize.width * coverScale * zoom;
  const displayH = naturalSize.height * coverScale * zoom;

  const {
    position,
    dragging,
    dragMoved: dragMovedRef,
    handleMouseDown,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    stopDragging,
    resetDragPosition,
    setPosition,
  } = useImageDrag(pendingImage, DRAG_CLICK_THRESHOLD_PX, {
    displayW,
    displayH,
    frameW: effectiveFrameW,
    frameH: effectiveFrameH,
  });

  const step: ImageModalStep = pendingImage
    ? IMAGE_MODAL.EDIT
    : IMAGE_MODAL.UPLOAD;

  const prevNaturalSizeRef = useRef({ width: 0, height: 0 });
  const fitZoomRef = useRef(IMAGE_ZOOM.DEFAULT);
  const imageLoadIdRef = useRef(0);

  const loadSelectedImageSize = useCallback((imageDataUrl: string) => {
    const loadId = imageLoadIdRef.current + 1;
    imageLoadIdRef.current = loadId;

    fitZoomRef.current = IMAGE_ZOOM.DEFAULT;
    setNaturalSize({ width: 0, height: 0 });

    const img = new Image();
    img.onload = () => {
      if (imageLoadIdRef.current !== loadId) return;

      setNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = imageDataUrl;
  }, []);

  useEffect(() => {
    if (!pendingImage) return;

    const loadId = imageLoadIdRef.current + 1;
    imageLoadIdRef.current = loadId;

    fitZoomRef.current = IMAGE_ZOOM.DEFAULT;

    const img = new Image();
    img.onload = () => {
      if (imageLoadIdRef.current !== loadId) return;

      setNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = pendingImage;
  }, [pendingImage]);

  useEffect(() => {
    const prev = prevNaturalSizeRef.current;
    const curr = naturalSize;
    prevNaturalSizeRef.current = curr;

    const justLoaded =
      prev.width === 0 &&
      prev.height === 0 &&
      curr.width > 0 &&
      curr.height > 0;
    if (!justLoaded) return;

    fitZoomRef.current = IMAGE_ZOOM.DEFAULT;
    setZoom(fitZoomRef.current);
    setPosition({ x: 0, y: 0 });
  }, [naturalSize, setPosition]);

  useEffect(() => {
    const el = previewFrameRef.current;
    if (!el || !visible) return;

    const updateSize = () => {
      setFrameSize({
        width: el.clientWidth || PREVIEW_FRAME_SIZE,
        height: el.clientHeight || PREVIEW_FRAME_SIZE,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [visible, pendingImage]);

  const resetState = useCallback(() => {
    setPendingImage(image);
    setZoom(fitZoomRef.current);
    resetDragPosition();
    setIsDragActive(false);
    setSizeError(null);
    onClose();
  }, [image, onClose, resetDragPosition]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const setSelectedImage = useCallback(
    (imageDataUrl: string) => {
      setPendingImage(imageDataUrl);
      loadSelectedImageSize(imageDataUrl);
      dragMovedRef.current = false;
    },
    [dragMovedRef, loadSelectedImageSize],
  );

  const handleImageFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        setSizeError(t("errors.imageTooLarge"));
        return;
      }

      setSizeError(null);

      readFileAsDataUrl(file).then(async (imageDataUrl) => {
        if (!imageDataUrl) return;

        const dimensions =
          recommendedText && !uploadAsIs
            ? await loadImageDimensions(imageDataUrl)
            : null;
        const isLowResolution = dimensions
          ? dimensions.width < cropWidth || dimensions.height < cropHeight
          : false;

        onImageSelected?.(imageDataUrl);
        if (isLowResolution) return;

        setSelectedImage(imageDataUrl);
      });
    },
    [
      cropHeight,
      cropWidth,
      maxSize,
      onImageSelected,
      recommendedText,
      setSelectedImage,
      t,
      uploadAsIs,
    ],
  );

  const handleSelectFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      event.target.value = "";
      handleImageFile(file);
    },
    [handleImageFile],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      handleImageFile(file);
    },
    [handleImageFile],
  );

  const handlePreviewClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    openFilePicker();
  };

  useEffect(() => {
    const el = previewFrameRef.current;
    if (!el || !pendingImage) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();

      const zoomStep = 0.05;
      const zoomDirection = e.deltaY < 0 ? 1 : -1;

      setZoom((prevZoom) => {
        const newZoom = Math.min(
          IMAGE_ZOOM.MAX,
          Math.max(IMAGE_ZOOM.DEFAULT, prevZoom + zoomDirection * zoomStep),
        );
        return Number(newZoom.toFixed(2));
      });
    };

    el.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheelEvent);
    };
  }, [pendingImage]);

  const isImageSizeReady = naturalSize.width > 0 && naturalSize.height > 0;
  const isNaturalSizeSmaller =
    naturalSize.width < cropWidth || naturalSize.height < cropHeight;
  const isBelowRecommendedSize =
    Boolean(recommendedText) &&
    !uploadAsIs &&
    isImageSizeReady &&
    isNaturalSizeSmaller;
  const isApplyDisabled = !isImageSizeReady || isBelowRecommendedSize;

  const applyCrop = useCallback(async () => {
    if (!pendingImage || !previewFrameRef.current || isApplyDisabled) return;

    if (uploadAsIs) {
      onApply(pendingImage);
      onClose();
      return;
    }

    const { width, height } = previewFrameRef.current.getBoundingClientRect();

    const cropped = await getCroppedImg(pendingImage, {
      containerWidth: width,
      containerHeight: height,
      cropWidth,
      cropHeight,
      position,
      zoom,
    });

    onApply(cropped);
    onClose();
  }, [
    pendingImage,
    cropWidth,
    cropHeight,
    position,
    zoom,
    onApply,
    onClose,
    isApplyDisabled,
    uploadAsIs,
  ]);

  return (
    <GenericModal
      visible={visible}
      title={step === IMAGE_MODAL.UPLOAD ? titleUpload : titleEdit}
      onClose={resetState}
      textAlign={MODAL_ALIGN.START}
      size="md"
    >
      <PhotoModalBody>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept={IMAGE_FILE_ACCEPT}
          onChange={handleSelectFile}
        />

        {step === IMAGE_MODAL.UPLOAD ? (
          <UploadDropZone
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            $isDragActive={isDragActive}
          >
            <UploadHint>{t("creatorProfile.dragPhotoHere")}</UploadHint>
            <UploadOrText>{t("creatorProfile.or")}</UploadOrText>
            <GenericButton variant={VARIANT.PRIMARY} onClick={openFilePicker}>
              {t("creatorProfile.choosePhoto")}
            </GenericButton>
            {recommendedText && (
              <UploadNoteText>
                {t("creatorProfile.recommendedImageSize", {
                  cropWidth,
                  cropHeight,
                })}
              </UploadNoteText>
            )}
            {sizeError && <UploadErrorText>{sizeError}</UploadErrorText>}
          </UploadDropZone>
        ) : (
          <>
            <CropCanvas
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <ImagePreviewWrapper
                ref={previewFrameRef}
                $cropWidth={cropWidth}
                $cropHeight={cropHeight}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDragging}
                onClick={handlePreviewClick}
                title={t("creatorProfile.clickPhotoToChange")}
              >
                {pendingImage && (
                  <BlurredBackground
                    src={pendingImage}
                    alt=""
                    draggable={false}
                  />
                )}
                {pendingImage && displayW > 0 && displayH > 0 && (
                  <ImagePreview
                    src={pendingImage}
                    alt="Preview"
                    $x={position.x}
                    $y={position.y}
                    $width={displayW}
                    $height={displayH}
                    $isDragging={dragging}
                    draggable={false}
                  />
                )}
                <CropOverlay $shape={shape} />
              </ImagePreviewWrapper>
            </CropCanvas>

            <ChangePhotoHint>
              {t("creatorProfile.clickPhotoToChange")}
            </ChangePhotoHint>

            <ZoomContainer>
              <ZoomSlider
                type="range"
                min={IMAGE_ZOOM.DEFAULT}
                max={IMAGE_ZOOM.MAX}
                step={IMAGE_ZOOM.STEP}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </ZoomContainer>

            <ModalActions>
              <GenericButton variant={VARIANT.SECONDARY} onClick={resetState}>
                {t("common.cancel")}
              </GenericButton>
              <GenericButton
                variant={VARIANT.PRIMARY}
                onClick={applyCrop}
                disabled={isApplyDisabled}
              >
                {t("creatorProfile.apply")}
              </GenericButton>
            </ModalActions>
          </>
        )}
      </PhotoModalBody>
    </GenericModal>
  );
}
