import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const PageShell = styled.div`
  width: 100%;
  min-height: calc(100vh - 110px);
  display: flex;
  justify-content: center;
  padding: 40px 24px 56px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.tablet} {
    padding: 28px 20px 48px;
  }
`;

export const PageInner = styled.div`
  width: min(100%, 1220px);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageTitle = styled(MonoText).attrs({
  $use: "H4_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  justify-content: center;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const CollectionCardSlot = styled.div`
  width: 100%;
  min-width: 0;
`;

export const CollectionListShell = styled.section`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 35px 0 100px 0;
  box-sizing: border-box;

  ${media.tablet} {
    padding-top: 28px;
  }
`;
