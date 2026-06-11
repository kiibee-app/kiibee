import styled, { keyframes } from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";
import { STATUS_TONE, type StatusTone } from "@/utils/Constants";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(0.98); }
`;

export const PageShell = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  color-scheme: light;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.colors.neutral.OFF_WHITE} 0%,
    ${({ theme }) => theme.colors.primary.PALE_GREEN} 55%,
    ${({ theme }) => theme.colors.neutral.OFF_WHITE} 100%
  );
`;

export const StatusCard = styled.section`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: 40px 32px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.gradient.FRAME_BORDER};
  box-shadow:
    0 24px 48px ${({ theme }) => theme.colors.gradient.FRAME_SHADOW},
    0 0 0 1px ${({ theme }) => theme.colors.gradient.FRAME_GLOW};

  ${media.tablet} {
    padding: 32px 24px;
    border-radius: 16px;
  }
`;

export const BrandMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const IconRing = styled.div<{ $tone?: StatusTone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme, $tone = STATUS_TONE.LOADING }) =>
    $tone === STATUS_TONE.ERROR
      ? "rgba(220, 38, 38, 0.08)"
      : $tone === STATUS_TONE.SUCCESS
        ? theme.colors.primary.PALE_GREEN
        : theme.colors.neutral.OFF_WHITE};
  border: 1px solid
    ${({ theme, $tone = STATUS_TONE.LOADING }) =>
      $tone === STATUS_TONE.ERROR
        ? "rgba(220, 38, 38, 0.16)"
        : $tone === STATUS_TONE.SUCCESS
          ? theme.colors.secondary.MEDIUM_GREEN
          : theme.colors.gradient.FRAME_BORDER};
  animation: ${({ $tone }) => ($tone === STATUS_TONE.LOADING ? pulse : "none")}
    2s ease-in-out infinite;
`;

export const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-top-color: ${({ theme }) => theme.colors.primary.GREEN};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const CardTitle = styled(MonoText).attrs({
  $use: "H5_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CardMessage = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  max-width: 320px;
`;

export const CardHint = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  max-width: 300px;
`;

export const ActionWrap = styled.div`
  width: 100%;
  max-width: 240px;
  margin-top: 4px;

  button {
    width: 100%;
  }
`;

export const ProgressDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const ProgressDot = styled.span<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary.GREEN : theme.colors.neutral.GRAY_200};
  transition: background 0.3s ease;
`;
