import styled from "styled-components";

export const HeroBlock = styled.section`
  gap: 0.75rem;
  padding: 4rem 0;
  text-align: center;
`;
export const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.75rem, 4.2vw, 3.5rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  line-height: 1.1;
`;
export const HeroSubtitle = styled.p`
  max-width: 56rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0 auto;
`;
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
`;
export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
export const SectionTag = styled.span`
  padding: 0.35rem 0;
  font-size: 1.375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
export const SectionLink = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1.766rem;
  padding: 0.432rem 0.353rem;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  border-radius: 100%;
`;
export const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;
