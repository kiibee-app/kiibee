import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;

  img {
    display: block;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Description = styled.p`
  max-width: 390px;
  margin: 0.5rem 0 1rem;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;

  button {
    width: 100%;
    margin-top: 1.5rem;
  }
`;
