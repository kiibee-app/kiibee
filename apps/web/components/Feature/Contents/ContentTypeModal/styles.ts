import { MonoText } from "@/components/UI/Monotext";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  display: flex;
  min-height: 330px;
  flex-direction: column;
  align-items: center;
  padding-top: 35px;

  ${media.tablet} {
    min-height: auto;
    padding-top: 28px;
    padding-bottom: 28px;
  }
`;

export const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 52px;
`;

export const ModalTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  padding-top: 20px;
`;

export const ModalSubtitle = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 76px);
  justify-content: center;
  gap: 14px;
  margin-bottom: 54px;

  ${media.tablet} {
    grid-template-columns: repeat(5, 64px);
    gap: 10px;
    margin-bottom: 32px;
  }

  ${media.mobileLg} {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

export const TypeButton = styled.button<{ $selected: boolean }>`
  width: 76px;
  height: 74px;
  border: none;
  border-radius: 8px;
  background: ${({ $selected, theme }) =>
    $selected
      ? theme.colors.neutral.PALE_GREEN
      : theme.colors.neutral.OFF_WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;

  ${media.tablet} {
    width: 64px;
    height: 66px;
    gap: 6px;
  }

  ${media.mobileLg} {
    width: calc((100% - 20px) / 3);
    height: 70px;
  }
`;

export const TypeLabel = styled(MonoText).attrs({
  $use: "Body_Bold",
})`
  color: inherit;
`;

export const ContinueButton = styled.button`
  width: 310px;
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY};
    cursor: not-allowed;
    opacity: 1;
  }

  ${media.tablet} {
    width: 100%;
    max-width: 310px;
  }
`;
