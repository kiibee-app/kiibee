import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primary.GRAY};
  padding: clamp(2.5rem, 8vw, 5rem) clamp(1rem, 4vw, 1.5rem);
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3.75rem);
`;

export const Title = styled.h2`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: clamp(1rem, 4vw, 1.25rem);
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const GridContainer = styled.div`
  max-width: 1240px;
  margin: 0 auto clamp(2.5rem, 6vw, 3.75rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const CategoryBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const CardTitle = styled.h3`
  margin: 0 0 0.25rem;
`;

export const CardAuthor = styled.p`
  margin: 0 0 0.25rem;
`;

export const CardDate = styled.p`
  margin: 0 0 1rem;
`;

export const MediaTypeBox = styled.div`
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: 8px;
  padding: 0.625rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
`;

export const MediaTypeText = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const ActionsContainer = styled.div`
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const ActionButton = styled(GenericButton).attrs({
  size: "sm",
})`
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN_30};
  padding: 0.625rem 0.75rem;
`;

export const FullWidthAction = styled(ActionButton)`
  grid-column: 1 / -1;
`;

export const BottomCtaSection = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const PrimaryCtaButton = styled(GenericButton).attrs({
  variant: "primary",
  size: "lg",
})`
  border-radius: 8px;
`;

export const SecondaryCtaButton = styled(GenericButton).attrs({
  size: "lg",
})`
  border-radius: 8px;
`;

export const IconFrame = styled.span`
  display: inline-flex;
  width: 16px;
  height: 16px;
`;
