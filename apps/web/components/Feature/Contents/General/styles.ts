import GenericButton from "@/components/UI/GenericButton";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const PanelStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const GeneralPanel = styled.section`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 18px 18px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;

  ${media.tablet} {
    padding: 16px;
  }
`;

export const DetailsWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DeleteButton = styled(GenericButton)`
  background: ${({ theme }) => theme.colors.primary.RED};
  border-color: ${({ theme }) => theme.colors.primary.RED};
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  box-shadow: 0 6px 18px ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
`;

export const DeleteAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

export const InfoColumn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 8px;
`;

export const PreviewBox = styled.div`
  width: 140px;
  height: 80px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PreviewVideo = styled.video`
  width: 100%;
  height: 100%;
  min-width: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

export const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0.6;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`;

export const ItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ControlWrap = styled.div`
  width: 100%;
  max-width: 460px;
`;
