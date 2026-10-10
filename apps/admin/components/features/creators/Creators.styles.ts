import styled from "styled-components";

export const EngagementList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const EngagementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const EngagementAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const EngagementMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EngagementName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const EngagementEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EngagementMeta = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

export const EngagementDate = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const EngagementSubDate = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  margin-top: 2px;
`;

export const ContentStatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const ContentStatBadge = styled.span<{
  $variant?: "buy" | "rent" | "download";
}>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme, $variant }) =>
    $variant === "buy"
      ? theme.colors.neutral.PALE_GREEN
      : $variant === "rent"
        ? theme.colors.primary.WHITE
        : theme.colors.neutral.GRAY_100};
  color: ${({ theme, $variant }) =>
    $variant === "buy"
      ? theme.colors.primary.GREEN_100
      : $variant === "rent"
        ? theme.colors.primary.ORANGE
        : theme.colors.secondary.muted};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "rent" ? theme.colors.primary.ORANGE : "transparent"};
`;

export const ClickableContentCard = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0;
  text-align: left;
  cursor: pointer;
  transition: box-shadow ${({ theme }) => theme.animations.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const CardCover = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const CardCoverBlur = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(4px);
  transform: scale(1.08);
  opacity: 1;
`;

export const CardCoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(12, 14, 18, 0.22) 0%,
    rgba(12, 14, 18, 0.06) 50%,
    rgba(12, 14, 18, 0.22) 100%
  );
`;

export const CardCoverMain = styled.img`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0;
`;

export const PriceMeta = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

export const PlayButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    opacity ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const RejectContentButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary.RED};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.RED};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    opacity ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.RED} 10%,
      ${({ theme }) => theme.colors.neutral.WHITE}
    );
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ModalDescription = styled.p`
  margin: 0 0 18px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.RED} 22%,
      ${({ theme }) => theme.colors.secondary.border}
    );
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.primary.RED} 7%,
    ${({ theme }) => theme.colors.neutral.WHITE}
  );
  font-size: 13px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ModalFieldLabel = styled.label`
  font-size: 13px;
  font-weight: 650;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const ModalTextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 108px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
  transition:
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.RED};
    box-shadow: 0 0 0 3px
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.primary.RED} 16%,
        transparent
      );
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ModalActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
`;

export const ModalCancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
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

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    border-color: ${({ theme }) => theme.colors.secondary.muted};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ModalConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 11px;
  border: 1px solid ${({ theme }) => theme.colors.primary.RED};
  background: ${({ theme }) => theme.colors.primary.RED};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    filter ${({ theme }) => theme.animations.fast},
    transform ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    filter: brightness(0.96);
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const PreviewFrame = styled.iframe<{ $tall?: boolean }>`
  width: 100%;
  aspect-ratio: ${({ $tall }) => ($tall ? "auto" : "16 / 9")};
  height: ${({ $tall }) => ($tall ? "70vh" : "auto")};
  min-height: ${({ $tall }) => ($tall ? "70vh" : "0")};
  border: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary.main};
`;

export const PreviewVideo = styled.video`
  width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary.main};
`;

export const PreviewAudio = styled.audio`
  width: 100%;
`;

export const PreviewState = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 14px;
`;

export const PreviewLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-weight: 600;
  word-break: break-all;
`;
