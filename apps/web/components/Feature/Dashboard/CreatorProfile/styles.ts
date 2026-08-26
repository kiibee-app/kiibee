import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";

export const Container = styled.div`
  padding: 24px 28px 36px;

  ${media.tablet} {
    padding: 20px 16px 28px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  ${media.mobile} {
    width: 100%;

    & > * {
      flex: 1;
    }
  }
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Card = styled.section<{ $emphasized?: boolean }>`
  margin-top: 16px;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border-radius: 12px;
  padding: 28px;
  border: 1px solid
    ${({ theme, $emphasized }) =>
      $emphasized
        ? "color-mix(in srgb, " +
          theme.colors.primary.RED +
          " 42%, transparent)"
        : "transparent"};
  box-shadow: ${({ theme, $emphasized }) =>
    $emphasized
      ? `0 0 0 3px color-mix(in srgb, ${theme.colors.primary.RED} 14%, transparent)`
      : "none"};
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  ${media.tablet} {
    padding: 20px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 24px;

  ${media.mobile} {
    gap: 16px;
    margin-bottom: 20px;
  }
`;

export const ProfileBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;

  ${media.tablet} {
    flex-direction: column;
    gap: 20px;
  }
`;

export const ProfileMain = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

export const PlanCardRoot = styled.aside`
  flex: 0 0 260px;
  width: 260px;
  overflow: hidden;
  padding: 18px 18px 16px;
  border-radius: 14px;
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN} 28%,
      ${({ theme }) => theme.colors.neutral.GRAY_200}
    );
  box-shadow:
    0 1px 2px ${({ theme }) => theme.colors.neutral.GRAY_300},
    0 8px 20px
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN} 8%,
        transparent
      );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  }

  ${media.tablet} {
    flex: none;
    width: 100%;
  }
`;

export const PlanCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
`;

export const PlanCardLabel = styled.div`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  text-transform: uppercase;
  letter-spacing: 0.06em;

  ${MonoText} {
    font-size: 11px;
    font-weight: 600;
    color: inherit;
  }
`;

export const PlanStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN} 18%,
    ${({ theme }) => theme.colors.neutral.WHITE}
  );
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.02em;
`;

export const PlanCardName = styled.div`
  color: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};

  ${MonoText} {
    color: inherit;
    font-size: 22px;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
`;

export const PlanCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

export const PlanMetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
`;

export const PlanCardActions = styled.div`
  margin-top: 16px;

  button {
    width: 100%;
    border-radius: 10px;
  }
`;

export const AvatarEditButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%) scale(0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  background: transparent;
  box-shadow: none;
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  opacity: 0;
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 2;
`;

export const Avatar = styled.div<{ $hasImage: boolean }>`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 9999px;
  background: ${({ $hasImage, theme }) =>
    $hasImage ? "transparent" : theme.colors.gradient.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  ${media.mobile} {
    width: 88px;
    height: 88px;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(p) => p.theme.colors.neutral.GRAY_400};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover ${AvatarEditButton} {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const Fields = styled.div`
  max-width: 640px;
`;

export const Action = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

export const TitleText = styled(MonoText).attrs({
  $use: "Body_Bold",
})`
  font-weight: 600;
  display: block;
  font-size: 20px;
  margin: 0 0 8px 0;
`;

export const DescriptionText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  display: block;
  margin-top: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  line-height: 1.5;
`;

export const DeleteButton = styled(GenericButton)`
  background: ${({ theme }) => theme.colors.secondary.RED};
  border-color: ${({ theme }) => theme.colors.secondary.RED};
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  box-shadow: 0 6px 18px ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
`;

export const DeleteAction = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const TwoColumnRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;

  & > * {
    flex: 1 1 0;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.primary.GRAY};
`;

export const Button = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.primary.BLACK};
  color: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border: none;
  cursor: pointer;

  &:disabled {
    background: ${(p) => p.theme.colors.neutral.GRAY_200};
    color: ${(p) => p.theme.colors.neutral.GRAY_400};
    border-color: ${(p) => p.theme.colors.neutral.GRAY_200};
    cursor: not-allowed;
    opacity: 1;
    pointer-events: none;
  }

  ${MonoText} {
    color: inherit;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  color: ${(p) => p.theme.colors.primary.BLACK};
  border: 1px solid ${(p) => p.theme.colors.primary.GRAY};

  &:not(:disabled) {
    background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
    color: ${(p) => p.theme.colors.primary.BLACK};
  }
`;

export const PasswordFields = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Optional = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-left: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const OptionalSmall = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-left: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const InlineLabel = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  display: inline-block;
  padding-left: 4px;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
