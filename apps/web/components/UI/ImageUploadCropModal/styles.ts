import styled from "styled-components";
import { MonoText } from "../Monotext";
import { CROP_SHAPE, CropShapeType } from "@/utils/ui";

export const HiddenInput = styled.input`
  display: none;
`;

export const PhotoModalBody = styled.div`
  margin-top: 20px;
`;

export const UploadDropZone = styled.div<{ $isDragActive?: boolean }>`
  min-height: 290px;
  border: 2px dashed
    ${({ theme, $isDragActive }) =>
      $isDragActive
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY_300};
  background-color: ${({ theme, $isDragActive }) =>
    $isDragActive ? theme.colors.neutral.OFF_WHITE : "transparent"};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease-in-out;
`;

export const UploadHint = styled(MonoText).attrs({
  $use: "H5_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const UploadOrText = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  margin: 6px 0;
`;

export const CropCanvas = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ImagePreviewWrapper = styled.div<{
  $cropWidth: number;
  $cropHeight: number;
}>`
  position: relative;
  width: 100%;
  max-width: ${({ $cropWidth, $cropHeight }) =>
    $cropHeight > 0 && $cropWidth > 0
      ? `min(100%, calc(320px * ${$cropWidth} / ${$cropHeight}))`
      : "100%"};
  aspect-ratio: ${({ $cropWidth, $cropHeight }) =>
    $cropHeight > 0 && $cropWidth > 0
      ? `${$cropWidth} / ${$cropHeight}`
      : "auto"};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.neutral.GRAY_700 || "#2a2b2f"} 0%,
    ${({ theme }) => theme.colors.gradient.NEAR_BLACK || "#060606"} 100%
  );
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:active {
    cursor: grabbing;
  }
`;

export const BlurredBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px) brightness(0.55);
  transform: scale(1.15);
  pointer-events: none;
  user-select: none;
  z-index: 1;
`;

export const ImagePreview = styled.img<{
  $x: number;
  $y: number;
  $width: number;
  $height: number;
  $isDragging: boolean;
}>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  max-width: none;
  max-height: none;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  z-index: 2;
  transform: ${({ $x, $y }) =>
    `translate(calc(-50% + ${$x}px), calc(-50% + ${$y}px))`};
  transition: ${({ $isDragging }) =>
    $isDragging
      ? "none"
      : "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), width 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1)"};
`;

export const ChangePhotoHint = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  text-align: center;
`;

export const CropOverlay = styled.div<{
  $shape: CropShapeType;
}>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-sizing: border-box;
  z-index: 3;

  ${({ $shape, theme }) =>
    $shape === CROP_SHAPE.CIRCLE &&
    `
    border-radius: 50%;
    box-shadow: 0 0 0 9999px ${theme.colors.neutral.OVERLAY};
  `}
`;

export const ZoomContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ZoomSlider = styled.input.attrs({ type: "range" })`
  width: 100%;
  cursor: pointer;
  height: 6px;
  border-radius: 5px;
  outline: none;
`;

export const UploadNoteText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  margin-top: 12px;
`;

export const UploadErrorText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.RED};
  margin-top: 12px;
  text-align: center;
`;
