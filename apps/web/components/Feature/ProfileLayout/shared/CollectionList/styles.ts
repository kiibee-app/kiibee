import styled from "styled-components";

export const CollectionListShell = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 10px 10px 100px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.primary.WHITE};

  ${({ theme }) => theme.media.desktopMd} {
    padding: 10px 10px 80px;
  }

  ${({ theme }) => theme.media.desktopSm} {
    padding: 10px 10px 88px;
  }

  ${({ theme }) => theme.media.tablet} {
    padding: 10px 10px 88px;
  }

  ${({ theme }) => theme.media.mobileLg} {
    padding: 10px 10px 46px;
  }
`;

export const CollectionListInner = styled.div`
  width: min(100%, 1380px);
  margin: 0 auto;
  padding: 0 6px;

  ${({ theme }) => theme.media.mobileLg} {
    padding: 0;
  }
`;
