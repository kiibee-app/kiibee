import styled from "styled-components";

export const HeaderRoot = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background-color: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const Description = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const HeaderUser = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AvatarFrame = styled.button`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  padding: 2px;
  background: ${({ theme }) => theme.colors.primary.BLUE};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
`;

export const AvatarText = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 2px solid ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const MenuWrap = styled.div`
  position: relative;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 140px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 6px;
  z-index: 30;
`;

export const MenuButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary.main};
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  }
`;
