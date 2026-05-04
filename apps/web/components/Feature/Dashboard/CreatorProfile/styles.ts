import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";

export const Container = styled.div`
  padding: 45px 28px 8px 28px;
`;

export const HeaderRow = styled.div`
  position: fixed;
  top: 70px;
  left: 250px;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  z-index: 110;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 18px 28px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Card = styled.section`
  margin-top: 16px;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border-radius: 12px;
  padding: 28px;
`;

export const Row = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

export const AvatarEditButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%) scale(0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  background: transparent;
  box-shadow: none;
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  opacity: 0;
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 2;
`;

export const Avatar = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.gredint.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(p) => p.theme.colors.neutral.GRAY_400};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover ${AvatarEditButton} {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Fields = styled.div`
  max-width: 640px;
`;

export const TitleText = styled(MonoText).attrs({
  $use: "Body_Bold",
})`
  font-weight: 600;
  display: block;
  font-size: 20px;
  margin: 0 0 8px 0;
`;

export const DescriptionText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  display: block;
  margin-top: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  line-height: 1.5;
`;

export const DeleteButton = styled(GenericButton)`
  background: ${({ theme }) => theme.colors.secondary.RED};
  border-color: ${({ theme }) => theme.colors.secondary.RED};
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  box-shadow: 0 6px 18px ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
`;

export const DeleteAction = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const TwoColumnRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;

  & > * {
    flex: 1 1 0;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.primary.GRAY};
`;

export const Action = styled.div`
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Button = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.neutral.GRAY};
  color: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  ${MonoText} {
    color: inherit;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  color: ${(p) => p.theme.colors.primary.BLACK};
  border: 1px solid ${(p) => p.theme.colors.primary.GRAY};
`;

export const PasswordFields = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Optional = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-left: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const OptionalSmall = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-left: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const InlineLabel = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  display: inline-block;
  padding-left: 4px;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const PhotoModalBody = styled.div`
  margin-top: 8px;
`;

export const UploadDropZone = styled.div`
  min-height: 240px;
  border: 1px dashed ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const UploadHint = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const UploadOrText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
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

export const ReactCropWrapper = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  .ReactCrop {
    max-width: 300px;
    max-height: 300px;
    overflow: hidden;
  }

  .ReactCrop__crop-selection {
    position: relative;
    border: 1px solid ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  }

  .ReactCrop__crop-mask {
    background: transparent;
  }

  .ReactCrop--circular-crop .ReactCrop__crop-selection:after {
    opacity: 1;
    border: 2px solid ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  }

  .ReactCrop__drag-handle.ord-n,
  .ReactCrop__drag-handle.ord-e,
  .ReactCrop__drag-handle.ord-s,
  .ReactCrop__drag-handle.ord-w {
    display: none;
  }

  .ReactCrop__drag-bar {
    display: none !important;
  }

  .ReactCrop__drag-bar::after,
  .ReactCrop__drag-handle::after {
    display: none !important;
  }

  .ReactCrop__drag-handle {
    display: none !important;
  }
`;

export const CropTargetImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  width: auto;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
`;

export const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
