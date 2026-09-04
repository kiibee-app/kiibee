import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";

export const HeaderRow = styled.div`
  position: sticky;
  top: -10px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: -40px -30px 28px -30px;
  padding: 40px 30px 16px 30px;
  background: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.desktop} {
    top: -8px;
    margin: -38px -30px 28px -30px;
    padding: 38px 30px 16px 30px;
  }

  ${media.tablet} {
    top: -8px;
    margin: -32px -20px 28px -20px;
    padding: 32px 20px 16px 20px;
  }

  ${media.mobileLg} {
    top: -8px;
    margin: -28px -16px 28px -16px;
    padding: 28px 16px 16px 16px;
  }

  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const SaveButton = styled(GenericButton)`
  min-width: 148px;
  border-radius: 8px;
`;

export const PasswordButton = styled(GenericButton)`
  width: 236px;
`;

export const ProfileSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 26px;

  ${media.mobile} {
    align-items: flex-start;
    gap: 18px;
  }
`;

export const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Form = styled.div`
  width: min(100%, 690px);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const PasswordRow = styled.div`
  margin-top: 17px;
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(220px, 360px);
  gap: 18px;
  align-items: end;

  ${PasswordButton} {
    justify-self: end;
  }

  ${media.mobile} {
    grid-template-columns: 1fr;

    ${PasswordButton} {
      justify-self: start;
    }
  }
`;

export const InlineLabel = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  display: block;
  padding-bottom: 12px;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  ${media.mobile} {
    padding-bottom: 0;
  }
`;
