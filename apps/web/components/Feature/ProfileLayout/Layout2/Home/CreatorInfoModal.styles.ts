import styled from "styled-components";

export const CreatorInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;
  height: 100%;
  max-height: 570px;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-right: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CreatorInfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 13px;
`;

export const BodyText = styled.div`
  white-space: pre-line;
  margin: 0;
`;

export const CloseIconButton = styled.button`
  width: 24px;
  height: 24px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 11px;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Section = styled.section`
  margin-top: 33px;
`;

export const LinkItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: none;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`;

export const ShareButton = styled.button`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 10px;
  height: 34px;
  padding: 5px 20px;
  border: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary.GREEN_50};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
  margin-top: 15px;
`;
