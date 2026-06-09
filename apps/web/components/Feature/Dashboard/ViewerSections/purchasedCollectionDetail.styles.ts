import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { Hero } from "@/components/Feature/SingleContentPage/styles";

export const DetailTopWrap = styled.div`
  margin-bottom: 20px;
`;

export const DetailPdfLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 376px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const DetailHeroWrap = styled.div<{ $isPdf?: boolean }>`
  > ${Hero} {
    width: 100%;
    max-width: ${({ $isPdf }) => ($isPdf ? "376px" : "1200px")};
    aspect-ratio: ${({ $isPdf }) => ($isPdf ? "376 / 530" : "16 / 10")};
    max-height: ${({ $isPdf }) => ($isPdf ? "530px" : "560px")};
    margin: ${({ $isPdf }) => ($isPdf ? "0" : "0 auto 20px")};
  }

  ${media.tablet} {
    > ${Hero} {
      max-width: 100%;
      max-height: ${({ $isPdf }) => ($isPdf ? "530px" : "300px")};
      margin: 0;
    }
  }

  ${media.mobileLg} {
    > ${Hero} {
      max-height: ${({ $isPdf }) => ($isPdf ? "530px" : "260px")};
    }
  }
`;

export const DetailBodyWrap = styled.div<{ $isPdf?: boolean }>`
  margin-bottom: ${({ $isPdf }) => ($isPdf ? "0" : "8px")};
  padding-bottom: 4px;
  align-self: start;

  ${media.tablet} {
    margin-bottom: 4px;
  }
`;

export const EmptyStateWrap = styled.div`
  padding: 24px 0;
`;
