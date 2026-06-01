import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { Hero } from "@/components/Feature/SingleContentPage/styles";

export const DetailTopWrap = styled.div`
  margin-bottom: 20px;
`;

export const DetailHeroWrap = styled.div`
  > ${Hero} {
    width: 100%;
    max-width: 1200px;
    aspect-ratio: 16 / 10;
    max-height: 560px;
    margin: 0 auto 20px;
  }

  ${media.tablet} {
    > ${Hero} {
      max-width: 100%;
      max-height: 300px;
    }
  }

  ${media.mobileLg} {
    > ${Hero} {
      max-height: 260px;
    }
  }
`;

export const DetailBodyWrap = styled.div`
  margin-bottom: 8px;
  padding-bottom: 4px;

  ${media.tablet} {
    margin-bottom: 4px;
  }
`;

export const EmptyStateWrap = styled.div`
  padding: 24px 0;
`;
