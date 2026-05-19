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

export const UploadHelperTextGroup = styled.div`
  min-height: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const UploadHelperText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  line-height: 1.35;
  text-align: center;
`;

export const UploadErrorText = styled(UploadHelperText)`
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const SelectedFileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 55px;
`;

export const FileDetailsWrapper = styled.div`
  width: 100%;
  max-width: 502px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PreviewFileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

export const FileInfoColumn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 8px;
`;

export const PreviewBox = styled.div`
  height: 64px;
`;

export const AddButtom = styled.div`
  margin-top: 24px;
`;

export const PreviewVideo = styled.video`
  width: 100%;
  height: 100%;
  min-width: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

export const WebContentForm = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WebContentTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const WebContentNextButton = styled.div`
  margin-top: auto;
  align-self: center;
`;
