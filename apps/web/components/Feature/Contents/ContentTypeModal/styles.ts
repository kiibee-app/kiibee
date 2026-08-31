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
  padding-top: 45px;

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

export const TypeGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $columns = 5 }) => $columns},
    minmax(0, 1fr)
  );
  width: 100%;
  gap: 12px;
  margin-bottom: 20px;

  ${media.mobileLg} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

export const TypeButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 108px;
  padding: 16px 8px;
  border: none;
  border-radius: 12px;
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
  gap: 10px;

  ${media.mobileLg} {
    min-height: 96px;
  }
`;

export const TypeLabel = styled(MonoText).attrs({
  $use: "Body_Bold",
})`
  color: inherit;
`;

export const CompactModalContent = styled(ModalContent)`
  min-height: 0;
  width: 100%;
  padding-top: 8px;
`;

export const CompactHeadingGroup = styled(HeadingGroup)`
  margin-bottom: 28px;
  gap: 8px;
`;

export const KindModalTitle = styled(ModalTitle)`
  padding-top: 0;
  text-align: center;
`;

export const KindModalSubtitle = styled(ModalSubtitle)`
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  text-align: center;
`;

export const KindGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
  gap: 20px;
  margin-bottom: 28px;

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const KindIconBadge = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const KindButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 148px;
  padding: 20px 16px 18px;
  border: 1.5px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary.BLACK : "transparent"};
  border-radius: 14px;
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
  gap: 10px;
  text-align: center;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    border-color: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_400};
  }

  ${media.mobileLg} {
    min-height: 128px;
  }
`;

export const KindLabel = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  color: inherit;
`;

export const KindHint = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  max-width: 160px;
  line-height: 1.35;
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
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    cursor: not-allowed;
    opacity: 1;
    pointer-events: none;
  }

  ${media.tablet} {
    width: 100%;
    max-width: 310px;
  }
`;

export const KindContinueButton = styled(ContinueButton)`
  width: 100%;
  max-width: none;
  height: 42px;
  border-radius: 10px;

  ${media.tablet} {
    width: 100%;
    max-width: none;
  }
`;
