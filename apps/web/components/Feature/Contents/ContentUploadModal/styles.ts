import { MonoText } from "@/components/UI/Monotext";
import { UploadDropZone } from "@/components/UI/ImageUploadCropModal/styles";
import { ModalContent } from "../ContentTypeModal/styles";
import styled from "styled-components";

export const UploadModalContent = styled(ModalContent)`
  height: 350px;
  padding: 60px 24px 28px;
`;

export const UploadBody = styled.div`
  width: 100%;
  max-width: 570px;
  height: 100%;
`;

export const ContentUploadDropZone = styled(UploadDropZone)`
  height: 268px;
  padding: 28px 20px;
  border-color: ${({ theme }) => theme.colors.neutral.GRAY_300};
  gap: 10px;
`;

export const ChooseUploadButton = styled.div`
  margin: 4px 0 8px;
`;

export const SelectedFileName = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  width: 100%;
  max-width: 320px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UploadHelperText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  line-height: 1.35;
  text-align: center;
  min-height: 38px;
`;
