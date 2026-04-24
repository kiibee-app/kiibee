import styled from "styled-components";

export const AdmissionCard = styled.div`
  width: 100%;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DropdownShell = styled.div`
  position: relative;
  width: min(100%, 457px);
`;

export const SelectButton = styled.button`
  width: 100%;
  min-height: 45px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    flex: 0 0 auto;
  }
`;

export const OptionsList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  box-shadow: 0 18px 32px ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const OptionButton = styled.button`
  width: 100%;
  min-height: 48px;
  border: 0;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  }
`;
