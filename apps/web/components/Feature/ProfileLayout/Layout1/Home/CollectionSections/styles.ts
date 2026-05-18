import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const SectionsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px 0 50px;
`;

export const SectionBlock = styled.section`
  width: 100%;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const SectionArrow = styled.span`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  font-size: 22px;
  line-height: 1;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  ${media.desktopMd} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const OneActionRow = styled.div`
  width: 100%;
`;

export const TwoActionRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const MetaPill = styled.div`
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: 8px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
`;
