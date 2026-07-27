import styled, { css, keyframes } from "styled-components";
import { media } from "@repo/ui/breakpoints";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AppearanceLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding-bottom: 96px;
  animation: ${fadeUp} 0.35s ease;
`;

export const AppearanceHero = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing(4)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(5)};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.neutral.WHITE} 0%,
    ${({ theme }) => theme.colors.neutral.PALE_GREEN} 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const AppearanceHeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const AppearanceEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const AppearanceTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 750;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const AppearanceSubtitle = styled.p`
  margin: 0;
  max-width: 54ch;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const AppearanceActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;

  ${media.mobileLg} {
    width: 100%;

    & > button {
      flex: 1;
    }
  }
`;

export const StickyActions = styled.div<{ $visible: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 40;
  transform: translateX(-50%)
    translateY(${({ $visible }) => ($visible ? "0" : "20px")});
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 10px 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.neutral.WHITE} 92%,
    transparent
  );
  backdrop-filter: blur(12px);
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition:
    opacity ${({ theme }) => theme.animations.fast},
    transform ${({ theme }) => theme.animations.fast};

  ${media.mobileLg} {
    left: 12px;
    right: 12px;
    bottom: 12px;
    transform: translateX(0)
      translateY(${({ $visible }) => ($visible ? "0" : "20px")});
    justify-content: space-between;
  }
`;

export const StickyHint = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
  white-space: nowrap;

  ${media.mobileLg} {
    display: none;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 12px;
  min-height: 42px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    transform ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  border-radius: 12px;
  min-height: 42px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    border-color: ${({ theme }) => theme.colors.secondary.muted};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const AppearancePanel = styled.section`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: ${({ theme }) => theme.spacing(4)}
    ${({ theme }) => theme.spacing(4.5)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.neutral.OFF_WHITE} 0%,
    ${({ theme }) => theme.colors.neutral.WHITE} 100%
  );
`;

export const PanelIndex = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-size: 12px;
  font-weight: 700;
`;

export const PanelHeaderCopy = styled.div`
  min-width: 0;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const PanelHint = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const PanelBody = styled.div`
  padding: ${({ theme }) => theme.spacing(4.5)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3.5)};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(3.5)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const FieldLabel = styled.span`
  font-size: 13px;
  font-weight: 650;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const FieldHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

const controlBase = css`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary.main};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  transition:
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  }
`;

export const TextInput = styled.input`
  ${controlBase};
  min-height: 44px;
  padding: 0 14px;
`;

export const TextArea = styled.textarea`
  ${controlBase};
  min-height: 120px;
  padding: 12px 14px;
  resize: vertical;
  line-height: 1.5;
`;

export const SelectInput = styled.select`
  ${controlBase};
  min-height: 44px;
  padding: 0 14px;
`;

export const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const LayoutCard = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 16px;
  border: 1.5px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary.GREEN : theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 12px;
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ $active, theme }) =>
    $active ? theme.shadows.md : theme.shadows.sm};
  transition:
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast},
    transform ${({ theme }) => theme.animations.fast};

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const LayoutPreview = styled.div<{ $variant: string; $active: boolean }>`
  position: relative;
  height: 112px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid
    ${({ theme }) =>
      `color-mix(in srgb, ${theme.colors.secondary.border} 80%, transparent)`};
  background: ${({ $active, theme }) =>
    $active
      ? `linear-gradient(160deg, ${theme.colors.neutral.PALE_GREEN} 0%, ${theme.colors.neutral.WHITE} 70%)`
      : `linear-gradient(160deg, ${theme.colors.neutral.OFF_WHITE} 0%, ${theme.colors.neutral.WHITE} 75%)`};

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    opacity: 0.28;
  }

  ${({ $variant }) => {
    if ($variant === "layout1") {
      return css`
        &::before {
          top: 10px;
          left: 10px;
          right: 10px;
          height: 34px;
          opacity: 0.35;
        }

        &::after {
          top: 54px;
          left: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          opacity: 0.45;
        }
      `;
    }

    if ($variant === "layout2") {
      return css`
        &::before {
          top: 8px;
          left: 18px;
          right: 18px;
          height: 42px;
          opacity: 0.35;
        }

        &::after {
          top: 38px;
          left: 50%;
          width: 34px;
          height: 34px;
          margin-left: -17px;
          border-radius: 50%;
          opacity: 0.5;
          box-shadow: 0 0 0 4px #fff;
        }
      `;
    }

    return css`
      &::before {
        top: 12px;
        left: 12px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        opacity: 0.45;
      }

      &::after {
        top: 18px;
        left: 58px;
        right: 12px;
        height: 24px;
        opacity: 0.28;
      }
    `;
  }}
`;

export const LayoutPreviewBars = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;

  span {
    display: block;
    height: 18px;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.secondary.border};
  }
`;

export const LayoutCardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px 4px;
`;

export const LayoutCardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const LayoutSelectedBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  transition: opacity ${({ theme }) => theme.animations.fast};
`;

export const LayoutCardDescription = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const ToggleRow = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  width: fit-content;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 9px;
  min-height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.colors.neutral.WHITE};
          color: ${theme.colors.primary.GREEN_100};
          box-shadow: ${theme.shadows.sm};
        `
      : css`
          background: transparent;
          color: ${theme.colors.secondary.muted};

          &:hover {
            color: ${theme.colors.secondary.main};
          }
        `}
`;

export const ImagePreview = styled.div<{ $empty?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  border: ${({ $empty, theme }) =>
    $empty
      ? `1.5px dashed ${theme.colors.secondary.border}`
      : `1px solid ${theme.colors.secondary.border}`};
  background: ${({ theme }) =>
    `linear-gradient(145deg, ${theme.colors.neutral.OFF_WHITE}, ${theme.colors.neutral.WHITE})`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoPreview = styled(ImagePreview)`
  aspect-ratio: 1;
  max-width: 148px;
  border-radius: 50%;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PreviewPlaceholder = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary.muted};

  svg {
    opacity: 0.55;
  }
`;

export const ImageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FileButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 11px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast};

  input {
    display: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
    color: ${({ theme }) => theme.colors.primary.GREEN_100};
  }
`;

export const DangerButton = styled.button`
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.RED} 35%,
      ${({ theme }) => theme.colors.secondary.border}
    );
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.RED};
  border-radius: 11px;
  min-height: 38px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.RED} 8%,
      ${({ theme }) => theme.colors.neutral.WHITE}
    );
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const CounterText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  align-self: flex-end;
`;

export const StatusMessage = styled.p<{ $tone?: "error" | "success" }>`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  border: 1px solid
    ${({ $tone, theme }) =>
      $tone === "error"
        ? `color-mix(in srgb, ${theme.colors.primary.RED} 30%, ${theme.colors.secondary.border})`
        : $tone === "success"
          ? `color-mix(in srgb, ${theme.colors.primary.GREEN} 35%, ${theme.colors.secondary.border})`
          : theme.colors.secondary.border};
  background: ${({ $tone, theme }) =>
    $tone === "error"
      ? `color-mix(in srgb, ${theme.colors.primary.RED} 8%, ${theme.colors.neutral.WHITE})`
      : $tone === "success"
        ? theme.colors.neutral.PALE_GREEN
        : theme.colors.neutral.OFF_WHITE};
  color: ${({ $tone, theme }) =>
    $tone === "error"
      ? theme.colors.primary.RED
      : $tone === "success"
        ? theme.colors.primary.GREEN_100
        : theme.colors.secondary.muted};
`;

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ColorSwatch = styled.input`
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  overflow: hidden;

  &::-webkit-color-swatch-wrapper {
    padding: 3px;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 8px;
  }
`;

export const LogoTextPreview = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 56px;
  padding: 12px 18px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.02em;
`;
