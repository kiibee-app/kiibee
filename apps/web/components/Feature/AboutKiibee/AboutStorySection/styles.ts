import styled from "styled-components";
import breakpoints from "../../../../../../packages/ui/src/breakpoints";

export const SectionWrapper = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 3.5rem 1.25rem 4.5rem;
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.25rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px 60px;
  align-items: start;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
export const Container = styled.div`
  max-width: 1218px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
`;
export const Title = styled.h2`
  font-size: 64px;
  font-weight: 600;
  line-height: 75px;
  margin-bottom: 10px;
`;

export const Text = styled.p`
  font-size: 1rem;
  font-weight: 400;
  line-height: normal;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 25px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
`;
