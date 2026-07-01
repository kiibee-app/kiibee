import styled from "styled-components";
import { typographyStyles } from "@/components/UI/Monotext/typography.styles";

export const PurchaseModalCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  border-radius: 12px;
  margin: 1.5rem 0 2rem;
  overflow: hidden;
`;

export const PurchaseModalCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
`;

export const PurchaseModalCardHeaderLabel = styled.span`
  ${typographyStyles.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalCardBody = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 1rem 1rem;
`;

export const PurchaseModalCardImage = styled.div`
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  img {
    object-fit: cover;
  }
`;

export const PurchaseModalCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const PurchaseModalCardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  width: fit-content;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PurchaseModalCardTitle = styled.div`
  ${typographyStyles.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PurchaseModalCardCreator = styled.div`
  ${typographyStyles.Body_Medium}
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const PurchaseModalCardPrice = styled.div`
  ${typographyStyles.Body_Bold}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
