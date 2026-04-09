import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";
import pricingCheckmark from "@/assets/icons/pricing-checkmark.png";

export const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 50px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: center;
  font-family: ${typography.Heading2.fontFamily};
  font-size: 40px;
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 600;
  line-height: normal;

  ${media.tablet} {
    font-size: 34px;
    margin-bottom: 36px;
  }
`;

export const CardsWrapper = styled.div`
  width: 100%;
  max-width: 1160px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 32px;
  flex-wrap: wrap;
`;

export const Card = styled.article<{ $highlight?: boolean }>`
  display: flex;
  width: 355.875px;
  height: 649.559px;
  padding: 40px 38.87px 39.734px 38.87px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8.638px;
  flex-shrink: 0;
  box-sizing: border-box;
  border-radius: ${({ $highlight }) => ($highlight ? "23.322px" : "24px")};
  background: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.neutral.OFF_WHITE : theme.colors.primary.WHITE};
  border: 2px solid
    ${({ theme, $highlight }) =>
      $highlight
        ? theme.colors.primary.PALE_GREEN
        : theme.colors.primary.WHITE};
`;

export const PlanTitle = styled.h3`
  width: 100%;
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  text-align: left;
  font-family: ${typography.Heading3.fontFamily};
  font-size: 32px;
  font-style: ${typography.Heading3.fontStyle};
  font-weight: 600;
  line-height: normal;
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0 0 8px 0;
  border: 0;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
`;

export const PlanPrice = styled.p`
  width: 100%;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: left;
  font-family: ${typography.Heading3.fontFamily};
  font-size: 32px;
  font-style: ${typography.Heading3.fontStyle};
  font-weight: 600;
  line-height: normal;
`;

export const Description = styled.p`
  width: 100%;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: left;
  font-family: ${typography.H5_Medium.fontFamily};
  font-size: 14px;
  font-style: ${typography.H5_Medium.fontStyle};
  font-weight: 500;
  line-height: normal;
`;

export const FeatureList = styled.ul`
  width: 100%;
  margin: 12px 0 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const TickIcon = styled.span`
  width: 17.275px;
  height: 19.003px;
  flex: 0 0 auto;
  background: url(${pricingCheckmark.src})
    ${({ theme }) => theme.colors.neutral.GRAY_100} 50% / contain no-repeat;
`;

export const FeatureText = styled.span`
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  font-family: ${typography.Body_Regular.fontFamily};
  font-size: 14px;
  font-style: ${typography.Body_Regular.fontStyle};
  font-weight: 400;
  line-height: normal;
`;

export const PlanButton = styled.button`
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  padding: 12px 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  cursor: pointer;
  font-family: ${typography.H5_Medium.fontFamily};
  font-size: 13px;
  font-style: ${typography.H5_Medium.fontStyle};
  font-weight: 500;
  line-height: normal;
  transition: opacity ${({ theme }) => theme.animations.fast};

  &:hover {
    opacity: 0.8;
  }
`;
