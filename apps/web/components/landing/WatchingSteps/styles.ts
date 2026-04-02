import styled from "styled-components";

const accent = "#8ee5bf";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: clamp(3rem, 4vw, 5rem) clamp(1.5rem, 4vw, 3rem) 4rem;
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  max-width: 540px;
`;

export const Heading = styled.h2`
  margin: 5rem 0 0.75rem;
  font-size: clamp(2.25rem, 3vw, 3rem);
  font-weight: 700;
`;

export const Tagline = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  opacity: 0.8;
  font-size: 1rem;
`;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
  }
`;

export const PreviewPanel = styled.div`
  border-radius: 8px;
`;

export const StepsColumn = styled.div`
  flex: 0 0 320px;
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
  gap: 1rem;
`;

export const StepNumber = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${accent};
`;

export const StepLabel = styled.h4`
  margin: 0;
  font-size: 1.05rem;
  text-transform: capitalize;
`;

export const StepDescription = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const CTAWrapper = styled.div`
  margin-top: 0.5rem;
  align-self: flex-start;
`;
