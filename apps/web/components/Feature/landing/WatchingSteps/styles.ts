import styled from "styled-components";
import { type CSSProperties } from "react";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  padding: clamp(2.5rem, 4vw, 4rem) clamp(1.5rem, 4vw, 3rem)
    clamp(3.5rem, 5vw, 6rem);
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const Header = styled.div`
  max-width: 540px;
`;

export const Heading = styled.h2`
  margin: 5rem 0 0.75rem;
`;

export const Tagline = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  opacity: 0.8;
  font-size: 1rem;
`;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 4rem);

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

export const PreviewPanel = styled.div`
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  max-width: 640px;
`;

export const StepsColumn = styled.div`
  flex: 0 0 441px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StepCard = styled.article`
  background: ${({ theme }) => theme.colors.primary.GREEN_10};
  border-radius: 12px;
  padding: 0.9375rem;
  border: 1px solid ${({ theme }) => theme.colors.primary.GREEN_30};
  display: flex;
  justify-content: space-between;
  gap: 8rem;
`;

export const StepNumber = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.PALE_GREEN};
`;

export const StepLabel = styled.h4`
  margin: 0;
  font-size: 1.05rem;
  text-transform: capitalize;
`;

export const StepDescription = styled.p`
  margin: 0.35rem 0 0;
`;

export const CTAWrapper = styled.div`
  margin-top: 1.875rem;
  align-self: flex-start;
`;

export const NumberPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const watchingStepsPreviewImageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  borderRadius: 8,
};
