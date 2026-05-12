"use client";

import React, { useCallback, useRef, useState } from "react";
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
} from "./styles";
import { GenericModal } from "@/components/UI/Modals";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import {
  CROP_SHAPE,
  CropShapeType,
  IMAGE_MODAL,
  ImageModalStep,
  MODAL_ALIGN,
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
  cropWidth = 220,
  cropHeight = 220,
  recommendedText = false,
}: Props) {
  const { t } = useTranslation();
  const [pendingImage, setPendingImage] = useState<string | null>(image);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const step: ImageModalStep = pendingImage
    ? IMAGE_MODAL.EDIT
    : IMAGE_MODAL.UPLOAD;

  const resetState = useCallback(() => {
    setPendingImage(image);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setDragging(false);
    dragRef.current = null;
    onClose();
  }, [image, onClose]);

  const handleSelectFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      event.target.value = "";

      readFileAsDataUrl(file).then((imageDataUrl) => {
        if (!imageDataUrl) return;

        setPendingImage(imageDataUrl);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      });
    },
    [],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!pendingImage) return;

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

    setPosition({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  };

  const stopDragging = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const applyCrop = useCallback(async () => {
    if (!pendingImage || !previewFrameRef.current) return;

    const { width, height } = previewFrameRef.current.getBoundingClientRect();

    const cropped = await getCroppedImg(
      pendingImage,
      width,
      height,
      {
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      },
      { x: position.x / zoom, y: position.y / zoom },
      zoom,
    );

    onApply(cropped);
    onClose();
  }, [
    pendingImage,
    cropWidth,
    cropHeight,
    position.x,
    position.y,
    zoom,
    onApply,
    onClose,
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
          accept="image/*"
          onChange={handleSelectFile}
        />

        {step === IMAGE_MODAL.UPLOAD ? (
          <UploadDropZone>
            <UploadHint>{t("creatorProfile.dragPhotoHere")}</UploadHint>
            <UploadOrText>{t("creatorProfile.or")}</UploadOrText>
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => fileInputRef.current?.click()}
            >
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
              >
                {pendingImage && (
                  <ImagePreview
                    src={pendingImage}
                    alt="Preview"
                    $x={position.x}
                    $y={position.y}
                    $zoom={zoom}
                    $isDragging={dragging}
                  />
                )}
                <CropOverlay
                  $shape={shape}
                  $width={cropWidth}
                  $height={cropHeight}
                />
              </ImagePreviewWrapper>
            </CropCanvas>

            <ZoomContainer>
              <ZoomSlider
                type="range"
                min={1}
                max={3}
                step={0.01}
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
