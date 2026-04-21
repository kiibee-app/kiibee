import styled from "styled-components";

export const CardShell = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 0.75rem;
  padding: 1.125rem 1.25rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 20px 45px ${({ theme }) => theme.colors.neutral.GRAY_300};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_100};

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 0.75rem;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: min(360px, 100%);

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    min-height: 420px;
    border-radius: 28px;
  }
`;

export const Tag = styled.span`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  box-shadow: 0 8px 16px ${({ theme }) => theme.colors.neutral.OVERLAY};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 100%;
  padding-top: 1.25rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const MetaItem = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const MetaDate = styled.span`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 25 / 19;
  overflow: hidden;
  border-radius: 0.75rem 0.75rem 0 0;
`;

export const VideoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.313rem;
  width: 100%;
  height: 33px;
  padding: 0.313rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: ${({ theme }) => theme.radius.xl};
  margin-top: 0.75rem;
`;

export const VideoLabel = styled.span`
  font-size: 0.688rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ActionRow = styled.div`
  margin-top: 0.85rem;
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  > * {
    flex: 1;
    min-width: 0;
  }
`;
