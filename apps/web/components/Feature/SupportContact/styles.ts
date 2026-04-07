import Link from "next/link";
import styled from "styled-components";
import breakpoints from "../../../../../packages/ui/src/breakpoints";
import GenericButton from "@/components/UI/GenericButton";

export const Section = styled.section`
  width: 100%;
  padding: 120px 28px 88px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px 16px 64px;
  }
`;

export const Panel = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px;
  border-radius: 28px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary.GREEN_50} 0%,
    ${({ theme }) => theme.colors.primary.PALE_GREEN} 100%
  );
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(380px, 1.1fr);
  gap: 36px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: 28px 20px;
    gap: 28px;
  }
`;

export const SuccessState = styled.div`
  grid-column: 1 / -1;
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 420px;
  }
`;

export const SuccessCard = styled.div`
  width: min(100%, 490px);
  min-height: 380px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 24px;
  padding: 56px 40px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 320px;
    padding: 40px 24px;
    gap: 12px;
  }
`;

export const SuccessIcon = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 1.8rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const SuccessTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.75rem;
  }
`;

export const SuccessText = styled.p`
  margin: 0;
  max-width: 281px;
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 100%;
    font-size: 0.95rem;
  }
`;

export const Content = styled.div`
  max-width: 420px;
`;

export const Title = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Description = styled.p`
  margin: 0 0 18px;
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ResourceCopy = styled.p`
  margin: 0 0 36px;
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const InlineLink = styled(Link)`
  color: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

export const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContactTitle = styled.h2`
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.15;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const EmailLink = styled.a`
  width: fit-content;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 1.2rem;
  line-height: 1.5;
  text-decoration: underline;
  text-underline-offset: 4px;
`;

export const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 24px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 20px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 14px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const FieldSlot = styled.div<{ $full?: boolean }>`
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "span 1")};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
`;

export const SubmitButton = styled(GenericButton)`
  && {
    min-width: 156px;
    height: 44px;
    border: none;
    border-radius: 9999px;
    background: ${({ theme }) => theme.colors.primary.BLACK};
    color: ${({ theme }) => theme.colors.primary.WHITE};
    box-shadow: none;
  }

  &&:hover {
    background: ${({ theme }) => theme.colors.primary.BLACK};
    color: ${({ theme }) => theme.colors.primary.WHITE};
    box-shadow: none;
    opacity: 0.92;
  }

  &&:disabled,
  &&:disabled:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_400};
    border: none;
    color: ${({ theme }) => theme.colors.primary.WHITE};
    opacity: 1;
    cursor: not-allowed;
  }
`;
