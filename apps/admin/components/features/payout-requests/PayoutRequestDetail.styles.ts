import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.secondary.main};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.GREEN};
    outline-offset: 5px;
  }
`;

export const Card = styled.section`
  min-width: 0;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 16px;
`;

export const CreatorHeader = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const CreatorIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

export const Avatar = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.primary.GREEN} 14%,
    white
  );
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 20px;
  font-weight: 700;
`;

export const CreatorText = styled.div`
  min-width: 0;
  h2 {
    margin: 0;
    font-size: 21px;
    letter-spacing: -0.025em;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.secondary.main};
  }
  p {
    margin: 6px 0 0;
    font-size: 13px;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.colors.secondary.muted};
  }
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  @media (max-width: 600px) {
    width: 100%;
    > button[data-download] {
      flex-basis: 100%;
    }
    > button {
      flex: 1 1 calc(50% - 5px);
      padding-inline: 12px;
    }
  }
`;

export const ApproveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 18px;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN};
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 150ms;
  &:hover:not(:disabled) {
    filter: brightness(0.94);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary.main};
    outline-offset: 3px;
  }
`;

export const DownloadButton = styled(ApproveButton)`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  border-color: ${({ theme }) => theme.colors.secondary.border};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
    filter: none;
  }
`;

export const RejectButton = styled(ApproveButton)`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.RED};
  border-color: ${({ theme }) => theme.colors.secondary.border};
  &:hover:not(:disabled) {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.primary.RED} 4%,
      white
    );
    filter: none;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.8fr 1.2fr;
  gap: 16px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled(Card)<{ $accent?: boolean }>`
  padding: 22px 24px;
  background: ${({ $accent, theme }) =>
    $accent
      ? `color-mix(in srgb, ${theme.colors.primary.GREEN} 10%, white)`
      : theme.colors.neutral.WHITE};
  border-color: ${({ $accent, theme }) =>
    $accent
      ? `color-mix(in srgb, ${theme.colors.primary.GREEN} 32%, white)`
      : theme.colors.secondary.border};
  @media (max-width: 800px) {
    ${({ $accent }) => $accent && "grid-column: 1 / -1;"}
  }
`;

export const SummaryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const SummaryValue = styled.div`
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: clamp(23px, 2.2vw, 30px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
`;

export const Caption = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const DetailColumns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  color: ${({ theme }) => theme.colors.secondary.main};
  h3 {
    font-size: 15px;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  svg {
    color: ${({ theme }) => theme.colors.secondary.muted};
    flex-shrink: 0;
  }
`;

export const FeeRows = styled.dl`
  margin: 0;
  padding: 4px 24px;
`;

export const FeeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 19px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  &:last-child {
    border-bottom: 0;
  }
  dt {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.secondary.main};
  }
  dd {
    margin: 0;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

export const FeeNote = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const NetRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin: 0 24px 24px;
  padding: 20px;
  border-radius: 10px;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.primary.GREEN} 9%,
    white
  );
  color: ${({ theme }) => theme.colors.secondary.main};
  span {
    font-size: 13px;
    font-weight: 600;
  }
  strong {
    font-size: 23px;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
`;

export const Metadata = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  margin: 0;
  div {
    min-width: 0;
  }
  dt {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.secondary.muted};
    margin-bottom: 7px;
  }
  dd {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.secondary.main};
    overflow-wrap: anywhere;
  }
  dd[data-id] {
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 12px;
  }
`;

export const WalletRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary.border};
  color: ${({ theme }) => theme.colors.secondary.muted};
  span {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  strong {
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

export const FeeError = styled.div`
  margin: 20px 24px 0;
  padding: 14px 16px;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.primary.RED} 25%, white);
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.primary.RED} 4%,
    white
  );
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.primary.RED};
  font-size: 13px;
  line-height: 1.6;
`;
