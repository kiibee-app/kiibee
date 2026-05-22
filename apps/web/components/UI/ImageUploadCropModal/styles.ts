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
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  padding: 24px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.BLACK};
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  }
`;

export const UploadHint = styled(MonoText).attrs({
  $use: "H5_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 4px;
`;

export const UploadOrText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  margin: 4px 0;
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
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

export const ImagePreview = styled.img<{
  $x: number;
  $y: number;
  $zoom: number;
  $isDragging: boolean;
}>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  transform: ${({ $x, $y, $zoom }) =>
    `translate(${$x}px, ${$y}px) scale(${$zoom})`};
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : "transform 0.1s ease-out"};
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
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.8);
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
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
`;
