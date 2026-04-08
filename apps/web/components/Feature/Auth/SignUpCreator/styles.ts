import Link from "next/link";
import styled from "styled-components";
import breakpoints from "../../../../../../packages/ui/src/breakpoints";

export const ContentWrap = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 118px 24px 96px;
  background: transparent;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
`;

export const BackButton = styled(Link)`
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const BrandMark = styled.span`
  width: 42px;
  height: 42px;
  margin: 0 auto 16px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
`;

export const FormTitle = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const FormIntro = styled.p`
  width: min(100%, 560px);
  margin: 10px auto 26px;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const Form = styled.form`
  width: 100%;
  max-width: 610px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const TernaryRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.3fr 0.9fr;
  gap: 10px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const FullRow = styled.div`
  width: 100%;
`;

export const HelpText = styled.p`
  margin: 6px 0 0;
  font-size: 0.75rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const CheckboxRow = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 14px;
  height: 14px;
  margin-top: 2px;
  accent-color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ConsentText = styled.label`
  font-size: 0.75rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: underline;
  text-underline-offset: 2px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 280px;
  height: 42px;
  margin: 8px auto 0;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    cursor: not-allowed;
  }
`;

export const LinkRow = styled.p`
  margin: 16px 0 0;
  width: 100%;
  text-align: center;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
`;
