import styled from "styled-components";
import { MonoText } from "../Monotext";

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
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ImagePreview = styled.img<{
  $x: number;
  $y: number;
  $zoom: number;
  $isDragging: boolean;
}>`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius[4]};
  object-fit: contain;
  pointer-events: none;
  transform: ${({ $x, $y, $zoom }) =>
    `translate(${$x}px, ${$y}px) scale(${$zoom})`};
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : "transform 0.1s ease-out"};
`;

export const CropOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
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
