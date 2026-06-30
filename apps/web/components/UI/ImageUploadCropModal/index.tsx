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
};

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
}: Props) {
  const { t } = useTranslation();
  const [pendingImage, setPendingImage] = useState<string | null>(image);
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setPendingImage(image);
    }
  }
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({
    width: PREVIEW_FRAME_SIZE,
    height: PREVIEW_FRAME_SIZE,
  });
  const [zoom, setZoom] = useState(IMAGE_ZOOM.DEFAULT);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);

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
  } = useImageDrag(pendingImage, DRAG_CLICK_THRESHOLD_PX);

  const step: ImageModalStep = pendingImage
    ? IMAGE_MODAL.EDIT
    : IMAGE_MODAL.UPLOAD;

  const prevNaturalSizeRef = useRef({ width: 0, height: 0 });
  const fitZoomRef = useRef(IMAGE_ZOOM.DEFAULT);

  useEffect(() => {
    if (!pendingImage) return;

    fitZoomRef.current = IMAGE_ZOOM.DEFAULT;

    const img = new Image();
    img.onload = () => {
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
      onImageSelected?.(imageDataUrl);
      setPendingImage(imageDataUrl);
      setNaturalSize({ width: 0, height: 0 });
      dragMovedRef.current = false;
    },
    [dragMovedRef, onImageSelected],
  );

  const handleSelectFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      event.target.value = "";
      if (file.size > maxSize) {
        setSizeError(t("errors.imageTooLarge"));
        return;
      }

      setSizeError(null);

      readFileAsDataUrl(file).then((imageDataUrl) => {
        if (!imageDataUrl) return;

        setSelectedImage(imageDataUrl);
      });
    },
    [maxSize, setSelectedImage, t],
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

      if (file.size > maxSize) {
        setSizeError(t("errors.imageTooLarge"));
        return;
      }

      setSizeError(null);

      readFileAsDataUrl(file).then((imageDataUrl) => {
        if (!imageDataUrl) return;

        setSelectedImage(imageDataUrl);
      });
    },
    [maxSize, setSelectedImage, t],
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
          Math.max(IMAGE_ZOOM.MIN, prevZoom + zoomDirection * zoomStep),
        );
        return Number(newZoom.toFixed(2));
      });
    };

    el.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheelEvent);
    };
  }, [pendingImage]);

  const applyCrop = useCallback(async () => {
    if (!pendingImage || !previewFrameRef.current) return;

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
  }, [pendingImage, cropWidth, cropHeight, position, zoom, onApply, onClose]);

  const frameW = frameSize.width;
  const frameH = frameSize.height;
  const coverScale =
    naturalSize.width > 0 && naturalSize.height > 0
      ? Math.min(frameW / naturalSize.width, frameH / naturalSize.height)
      : 1;
  const displayW = naturalSize.width * coverScale * zoom;
  const displayH = naturalSize.height * coverScale * zoom;

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
            <CropCanvas>
              <ImagePreviewWrapper
                ref={previewFrameRef}
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
                <CropOverlay
                  $shape={shape}
                  $width={Math.max(cropWidth, frameW)}
                  $height={Math.max(cropHeight, frameH)}
                />
              </ImagePreviewWrapper>
            </CropCanvas>

            <ChangePhotoHint>
              {t("creatorProfile.clickPhotoToChange")}
            </ChangePhotoHint>

            <ZoomContainer>
              <ZoomSlider
                type="range"
                min={IMAGE_ZOOM.MIN}
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
              <GenericButton variant={VARIANT.PRIMARY} onClick={applyCrop}>
                {t("creatorProfile.apply")}
              </GenericButton>
            </ModalActions>
          </>
        )}
      </PhotoModalBody>
    </GenericModal>
  );
}
