import breakpoints from "@repo/ui/breakpoints";
import Link from "next/link";
import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";

export const ContentWrap = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 24px 96px;
  background: transparent;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
`;

export const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

export const LogoWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  img {
    display: block;
  }
`;

export const FormTitle = styled.h1`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const FormIntro = styled.p`
  width: min(100%, 560px);
  margin: 10px auto 26px;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const Form = styled.form`
  width: 100%;
  max-width: 750px;
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
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const FormMessage = styled.p<{ $tone: "error" | "success" }>`
  margin: 2px 0 0;
  text-align: center;
  color: ${({ $tone, theme }) =>
    $tone === "success"
      ? theme.colors.primary.GREEN_200
      : theme.colors.primary.RED};
`;

export const CheckboxRow = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 14px;
  height: 14px;
  margin-top: 2px;
  accent-color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ConsentText = styled.label`
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: underline;
  text-underline-offset: 2px;
  padding-left: 5px;
`;

export const SubmitButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.MD,
})`
  width: 100%;
  max-width: 280px;
  height: 42px;
  border: none;
  margin: 8px auto 0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    cursor: not-allowed;
  }
`;

export const LinkRow = styled.p`
  margin: 16px 0 0;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
`;

export const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: underline;
  text-underline-offset: 2px;
  padding-left: 5px;
`;
