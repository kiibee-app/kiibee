import styled from "styled-components";

export const TabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 10px 0 8px;
  cursor: pointer;
  ${({ theme, $active }) =>
    $active ? theme.typography.Body_SemiBold : theme.typography.Body_Regular};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_400};

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    border-radius: 0;
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary.BLACK : "transparent"};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }
`;

export const SearchArea = styled.div<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  width: ${({ $open }) => ($open ? "260px" : "36px")};
  height: 36px;
  box-sizing: border-box;
  padding: ${({ $open }) => ($open ? "8px 12px" : "8px")};
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid
    ${({ $open, theme }) =>
      $open ? theme.colors.primary.GRAY : theme.colors.neutral.WHITE};
  background: ${({ $open, theme }) =>
    $open ? theme.colors.neutral.OFF_WHITE : theme.colors.neutral.WHITE};
  cursor: ${({ $open }) => ($open ? "text" : "pointer")};
  transition: all 0.25s ease;

  ${({ theme }) => theme.media.tablet} {
    width: ${({ $open }) => ($open ? "220px" : "36px")};
  }

  ${({ theme }) => theme.media.mobile} {
    width: ${({ $open }) => ($open ? "100%" : "36px")};
  }
`;

export const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  cursor: pointer;
`;

export const SearchInput = styled.input<{ $open: boolean }>`
  border: none;
  background: transparent;
  outline: none;
  margin-left: ${({ $open }) => ($open ? "8px" : "0")};
  padding: 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  flex: ${({ $open }) => ($open ? 1 : "0 0 auto")};
  min-width: 0;
  width: ${({ $open }) => ($open ? "auto" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: all 0.25s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
`;

export const SearchClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  padding: 0;
  margin-left: 4px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  cursor: pointer;
  flex-shrink: 0;
`;
