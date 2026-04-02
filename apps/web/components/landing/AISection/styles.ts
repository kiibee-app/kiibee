import styled from "styled-components";

const sectionBg = "#031d0f";
const trendCardBg = "#fefefe";
const stepCardBg = "rgba(255, 255, 255, 0.04)";
const accent = "#8ee5bf";

export const Section = styled.section`
  width: 100%;
  background: ${sectionBg};
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
  margin: 0 0 0.75rem;
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
  flex: 1;
  background: #0b2113;
  border-radius: 28px;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const PanelHeading = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
`;

export const TrendCard = styled.article`
  background: ${trendCardBg};
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(2, 6, 23, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid rgba(15, 23, 42, 0.1);
`;

export const TrendTag = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4b5563;
`;

export const TrendTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

export const TrendMeta = styled.span`
  font-size: 0.8rem;
  color: #374151;
`;

export const TrendAction = styled.span`
  margin-top: auto;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 999px;
  align-self: flex-start;
  background: rgba(15, 23, 42, 0.08);
  font-weight: 600;
  color: #111827;
`;

export const CreatorsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const CreatorPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const CreatorAvatar = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(120deg, #1fa18b, #0b6d6b);
  display: inline-flex;
`;

export const CreatorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CreatorName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
`;

export const CreatorSubtext = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
`;

export const StepsColumn = styled.div`
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StepCard = styled.article`
  background: ${stepCardBg};
  border-radius: 20px;
  padding: 1.4rem 1.6rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  gap: 1rem;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
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
