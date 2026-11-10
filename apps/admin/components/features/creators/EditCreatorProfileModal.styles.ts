import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(3)};

  ${media.mobileLg} {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FormGroupFull = styled(FormGroup)`
  grid-column: 1 / -1;
`;

export const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RequiredBadge = styled.span`
  color: #ef4444;
  font-size: 14px;
`;

export const FormInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: 10px;
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary.muted};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
    color: ${({ theme }) => theme.colors.secondary.muted};
    cursor: not-allowed;
  }
`;

export const FormHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  line-height: 1.4;
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  min-height: 40px;
  padding: 0 20px;
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
    transform ${({ theme }) => theme.animations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    border-color: ${({ theme }) => theme.colors.neutral.DUSTY_TEAL};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
