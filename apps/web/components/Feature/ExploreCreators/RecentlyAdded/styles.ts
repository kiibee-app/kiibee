import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: min(100%, 1300px);
  margin: 0 auto;
  padding: 40px 0;

  ${media.tablet} {
    width: 100%;
    padding: 2rem 1.25rem;
  }
`;

export const Content = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const SectionTag = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
`;
