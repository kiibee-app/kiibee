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
} from "@/utils/ui";
import { getCroppedImg, readFileAsDataUrl } from "@/utils/image";
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
}: Props) {
  const { t } = useTranslation();
  const [pendingImage, setPendingImage] = useState<string | null>(image);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({
    width: PREVIEW_FRAME_SIZE,
    height: PREVIEW_FRAME_SIZE,
  });
  const [zoom, setZoom] = useState(IMAGE_ZOOM.DEFAULT);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const dragMovedRef = useRef(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const step: ImageModalStep = pendingImage
    ? IMAGE_MODAL.EDIT
    : IMAGE_MODAL.UPLOAD;

  useEffect(() => {
    if (!pendingImage) return;

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
    setZoom(IMAGE_ZOOM.DEFAULT);
    setPosition({ x: 0, y: 0 });
    setDragging(false);
    dragRef.current = null;
    dragMovedRef.current = false;
    onClose();
  }, [image, onClose]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSelectFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      event.target.value = "";

      readFileAsDataUrl(file).then((imageDataUrl) => {
        if (!imageDataUrl) return;

        setPendingImage(imageDataUrl);
        setZoom(IMAGE_ZOOM.DEFAULT);
        setPosition({ x: 0, y: 0 });
        dragMovedRef.current = false;
      });
    },
    [],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!pendingImage) return;

    dragMovedRef.current = false;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };

    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.hypot(dx, dy) > DRAG_CLICK_THRESHOLD_PX) {
      dragMovedRef.current = true;
    }

    setPosition({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  };

  const stopDragging = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const handlePreviewClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    openFilePicker();
  };

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
      ? Math.max(frameW / naturalSize.width, frameH / naturalSize.height)
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
          <UploadDropZone>
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
                  $width={cropWidth}
                  $height={cropHeight}
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
