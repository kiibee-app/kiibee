import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const PaymentCard = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 16px;
  padding: 20px 16px;
`;

export const PaymentForm = styled.div`
  width: min(100%, 720px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Block = styled.div<{ $isFree?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: ${({ $isFree }) => ($isFree ? 0.5 : 1)};
  pointer-events: ${({ $isFree }) => ($isFree ? "none" : "auto")};
`;

export const ControlWrap = styled.div`
  width: min(100%, 483px);
`;

export const FeeNote = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Small}
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_SemiBold}
  padding-bottom: 4px;
`;

export const SectionText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  ${({ theme }) => theme.typography.Body_Medium}
  padding-bottom: 12px;
`;

export const DropdownWrap = styled.div`
  width: min(100%, 483px);

  > div {
    max-width: 100%;
  }
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${media.mobileLg} {
    display: none;
  }
`;
