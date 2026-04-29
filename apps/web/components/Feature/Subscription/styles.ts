import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import { media } from "@repo/ui/breakpoints";

export const SubscriptionShell = styled.section`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const SubscriptionPageInner = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(5)}
    ${({ theme }) => theme.spacing(8)};
`;

export const BackRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const Content = styled.div`
  width: 100%;
  max-width: 649px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(14.25)};
  padding-top: ${({ theme }) => theme.spacing(12.5)};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Title = styled(MonoText).attrs({
  $use: "H4_Medium",
  as: "h1",
})`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  max-width: 420px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const PlanSelectRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(7.5)};
`;

export const FieldGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  ${media.desktop} {
    gap: ${({ theme }) => theme.spacing(3)};
  }
`;

export const TwoColumnRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;
