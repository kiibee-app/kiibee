import styled from "styled-components";

export const Section = styled.section`
  width: 100%;
  position: relative;
  display: block;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

export const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: normal;
  margin-bottom: 20px;
`;

export const Subtitle = styled.h3`
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  line-height: normal;
  margin-bottom: 4.8rem;
`;

export const CTAWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
