import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_100};
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
`;

export const Main = styled.main`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    margin-left: 0;
  }
`;

export const Content = styled.div`
  padding: 16px 20px;

  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    padding: 12px;
  }

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    padding: 8px;
  }
`;

export const Backdrop = styled.div`
  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    position: fixed;
    inset: 0;
    z-index: 40;
  }
`;
