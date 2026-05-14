import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";
import pricingCheckmark from "@/assets/icons/pricing-checkmark.webp";

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
  ${({ theme }) => theme.typography.Heading2};
  margin: 0 0 50px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: center;
  font-family: ${typography.Heading2.fontFamily};
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 600;
  line-height: normal;

  ${media.tablet} {
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
  ${({ theme }) => theme.typography.Heading3};
  width: 100%;
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  text-align: left;
  font-family: ${typography.Heading3.fontFamily};
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
  ${({ theme }) => theme.typography.Heading3};
  width: 100%;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: left;
  font-family: ${typography.Heading3.fontFamily};
  font-style: ${typography.Heading3.fontStyle};
  font-weight: 600;
  line-height: normal;
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.H5_Medium};
  width: 100%;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  text-align: left;
  font-family: ${typography.H5_Medium.fontFamily};
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
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.BLACK};
  font-family: ${typography.Body_Regular.fontFamily};
  font-style: ${typography.Body_Regular.fontStyle};
  font-weight: 400;
  line-height: normal;
`;

export const PlanButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.MD,
})`
  margin-top: auto;
  align-self: flex-start;
  width: 180px;
  padding: 12px 0;
  border-radius: ${({ theme }) => theme.radius.full};
`;
