import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
  margin-bottom: 12px;
  width: 100%;
  padding-left: 10px;
`;

export const PageWrap = styled.div`
  padding: 40px 30px;
  margin-right: 30px;

  ${media.tablet} {
    padding: 20px;
    margin-right: 10px;
  }
`;

export const SectionBlock = styled.section`
  margin-top: 35px;

  &:first-of-type {
    margin-top: 24px;
  }
`;

export const SectionTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
