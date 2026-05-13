import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";

export const Section = styled.section`
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px 20px 50px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => theme.typography.Heading2};
  margin: 0 0 36px 0;
  font-size: clamp(1.65rem, 3.75vw, 2.35rem);
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: center;
  font-family: ${typography.Heading2.fontFamily};
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;

  ${media.tablet} {
    margin-bottom: 28px;
  }
`;

export const CardsWrapper = styled.div`
  width: 100%;
  max-width: 1120px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 22px;
  flex-wrap: wrap;
`;

export const Card = styled.article<{ $highlight?: boolean }>`
  display: flex;
  width: 100%;
  max-width: 340px;
  min-height: 0;
  height: auto;
  padding: 30px 24px 26px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 8px;
  flex: 1 1 280px;
  box-sizing: border-box;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border: 1px solid
    ${({ theme, $highlight }) =>
      $highlight
        ? theme.colors.secondary.MEDIUM_GREEN
        : theme.colors.neutral.GRAY_200};
  box-shadow: ${({ $highlight }) =>
    $highlight
      ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(146, 179, 129, 0.15)"
      : "0 4px 24px rgba(0, 0, 0, 0.06)"};
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: ${({ $highlight }) =>
      $highlight
        ? "0 12px 36px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(146, 179, 129, 0.2)"
        : "0 8px 28px rgba(0, 0, 0, 0.08)"};
  }
`;

export const PlanTitle = styled.h3`
  ${({ theme }) => theme.typography.Heading3};
  width: 100%;
  margin: 0 0 4px 0;
  font-size: clamp(1.05rem, 2.1vw, 1.2rem);
  color: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  text-align: left;
  font-family: ${typography.Heading3.fontFamily};
  font-style: ${typography.Heading3.fontStyle};
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 4px 0 10px 0;
  border: 0;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const PlanPrice = styled.p`
  width: 100%;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: left;
  font-family: ${typography.Heading2.fontFamily};
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 700;
  font-size: clamp(1.5rem, 3.25vw, 1.85rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.Body_Regular};
  width: 100%;
  margin: 0 0 8px 0;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: left;
  font-family: ${typography.Body_Regular.fontFamily};
  font-style: ${typography.Body_Regular.fontStyle};
  font-weight: 400;
  line-height: 1.5;
`;

export const FeatureList = styled.ul`
  width: 100%;
  margin: 14px 0 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const TickIcon = styled.span`
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;

  &::before {
    content: "✓";
  }
`;

export const FeatureText = styled.span`
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  font-family: ${typography.Body_Regular.fontFamily};
  font-style: ${typography.Body_Regular.fontStyle};
  font-weight: 400;
  line-height: 1.45;
  font-size: 0.875rem;
`;

export const PlanButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.MD,
})`
  margin-top: 20px;
  align-self: stretch;
  width: 100%;
  max-width: 100%;
  padding: 12px 18px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9375rem;
`;
