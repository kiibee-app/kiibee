import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";

export const Container = styled.section`
  width: 100%;
  padding: 20px 20px 36px;

  ${media.tablet} {
    padding: 16px 12px 28px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;

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

export const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gredint.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
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
