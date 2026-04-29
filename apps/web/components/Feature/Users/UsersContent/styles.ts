import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 24px;

  ${({ theme }) => theme.media.tablet} {
    padding: 20px;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 16px;
  }
`;

export const Title = styled.h2`
  margin: 0 0 12px 0;
  ${({ theme }) => theme.typography.H4_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 0;
  min-height: 52px;

  ${({ theme }) => theme.media.tablet} {
    justify-content: space-between;
    gap: 12px;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  align-self: stretch;
  flex-shrink: 0;

  ${({ theme }) => theme.media.tablet} {
    gap: 16px;
  }
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary.BLACK : "transparent"};
  background: transparent;
  cursor: pointer;
  ${({ theme, $active }) =>
    $active ? theme.typography.Body_SemiBold : theme.typography.Body_Regular};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_400};
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
`;

export const SearchArea = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  width: ${({ $open }) => ($open ? "240px" : "36px")};
  height: 36px;
  box-sizing: border-box;
  padding: ${({ $open }) => ($open ? "8px 12px" : "8px")};
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  cursor: ${({ $open }) => ($open ? "text" : "pointer")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ theme }) => theme.media.tablet} {
    width: ${({ $open }) => ($open ? "200px" : "36px")};
  }

  ${({ theme }) => theme.media.mobile} {
    width: ${({ $open }) => ($open ? "100%" : "36px")};
  }
`;

export const SearchIconWrap = styled.button`
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
  width: ${({ $open }) => ($open ? "100%" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  }
`;

export const ContentCard = styled.div`
  margin-top: 24px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.tablet} {
    margin-top: 16px;
    padding: 16px;
  }
`;

export const ContentTitle = styled.h3`
  margin: 0;
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ContentDescription = styled.p`
  margin: 10px 0 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;
