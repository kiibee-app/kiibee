import Link from "next/link";
import styled from "styled-components";

export const ContentWrap = styled.section`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 30px 24px 96px;
`;

export const Wrapper = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  gap: 0.5rem;

  img {
    display: block;
    margin-bottom: 0.5rem;
  }
`;

export const Title = styled.h1`
  margin: 0 0 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  button[type="submit"] {
    width: 100%;
    margin-top: 0.75rem;
  }

  button[type="submit"]:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    border-color: ${({ theme }) => theme.colors.neutral.GRAY_400};
    box-shadow: none;
    cursor: not-allowed;
  }
`;

export const FormMessage = styled.p`
  width: 100%;
  margin: 0.25rem 0 0;
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

export const Checkbox = styled.input`
  width: 14px;
  height: 14px;
  margin: 2px 0 0;
  accent-color: ${({ theme }) => theme.colors.primary.BLACK};
  flex: 0 0 auto;
`;

export const ConsentText = styled.label`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-weight: 700;
  text-decoration: none;
`;

export const LoginRow = styled.p`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 2rem 0 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-weight: 700;
  text-decoration: none;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-align: center;
  padding-bottom: 30px;
`;

export const PrepCard = styled(Card)`
  padding: 3.625rem 5.125rem;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 12px;
  width: min(100%, 620px);
  max-width: none;
  margin: 0 auto;

  button {
    width: 100%;
    margin-top: 0.75rem;
  }
`;

export const PreContentWrap = styled.div`
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  width: 100%;
  height: 100vh;
`;
