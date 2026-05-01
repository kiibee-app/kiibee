import styled from "styled-components";

export const SectionCard = styled.section`
  margin-top: 24px;
  padding: 20px 16px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};

  ${({ theme }) => theme.media.tablet} {
    margin-top: 16px;
    padding: 18px 14px;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 16px 12px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const SectionDescription = styled.p`
  margin: 10px 0 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const TableSection = styled.div`
  margin-top: 16px;
  padding-right: 26px;
`;

export const DeleteActionButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  font-size: 16px;
  line-height: 1;
`;
