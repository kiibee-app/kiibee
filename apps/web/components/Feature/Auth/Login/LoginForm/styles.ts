import Link from "next/link";
import styled from "styled-components";
export const Wrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;
export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;
export const LogoCircle = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.04em;
`;
export const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;
export const OptionsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  gap: 1rem;
  flex-wrap: wrap;
`;
export const RememberLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  cursor: pointer;
  margin: 1.25rem 0 2.5rem 0;
  input {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
    accent-color: ${({ theme }) => theme.colors.primary.BLACK};
    cursor: pointer;
  }
`;
export const ForgotLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: underline;
  margin: 1.25rem 0 3.75rem 0;
`;
export const SubmitButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 999px;
  height: 46px;
  font-size: 1rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.neutral.GRAY_300};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  transition:
    background 150ms ease,
    transform 150ms ease;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    transform: translateY(-1px);
  }
`;
export const FooterText = styled.p`
  margin: 1.25rem 0 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;
export const SignUpLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: underline;
  margin-left: 0.2rem;
`;
