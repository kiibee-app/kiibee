import styled from "styled-components";
import { MonoText } from "../Monotext";
import { CROP_SHAPE, CropShapeType } from "@/utils/ui";

export const HiddenInput = styled.input`
  display: none;
`;

export const PhotoModalBody = styled.div`
  margin-top: 20px;
`;

export const UploadDropZone = styled.div`
  min-height: 290px;
  border: 2px dashed ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  height: 320px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
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

export const ImagePreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:active {
    cursor: grabbing;
  }
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
  object-fit: fill;
  pointer-events: none;
  user-select: none;
  transform: ${({ $x, $y }) =>
    `translate(calc(-50% + ${$x}px), calc(-50% + ${$y}px))`};
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : "transform 0.1s ease-out"};
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
  $width: number;
  $height: number;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  transform: translate(-50%, -50%);
  border-radius: ${({ $shape }) =>
    $shape === CROP_SHAPE.CIRCLE ? "50%" : "0"};
  box-shadow: 0 0 0 9999px ${({ theme }) => theme.colors.neutral.GRAY_400};
  border: 2px solid transparent;
  pointer-events: none;
  z-index: 2;
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
