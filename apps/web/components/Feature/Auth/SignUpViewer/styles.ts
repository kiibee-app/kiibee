import Link from "next/link";
import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

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
  margin: 0 0;
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
  box-sizing: border-box;
  padding: 3.625rem 5.125rem;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border-radius: 12px;
  width: min(100%, 620px);
  max-width: none;
  margin: 0 auto;

  .preference-continue-btn {
    width: min(100%, 300px);
    margin-top: 0.75rem;
  }

  ${media.tablet} {
    padding: 1.5rem 1rem;
  }

  ${media.mobile} {
    width: 100%;
    border-radius: 10px;
    padding: 1.5rem 1rem;

    .preference-continue-btn {
      width: min(100%, 260px);
      margin-top: 0.5rem;
    }
  }
`;

export const CardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const InlineBackButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const StepSubtitle = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary.muted};

  ${media.mobile} {
    margin-top: 0.15rem;
  }
`;

export const CategoryGrid = styled.div`
  width: min(100%, 520px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
  padding-top: 1.5rem;
  margin: 0.5rem auto 1rem;

  ${media.mobile} {
    gap: 0.5rem;
    padding-top: 1rem;
  }
`;

export const CategoryChip = styled.button<{ $selected: boolean }>`
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  cursor: pointer;
  ${({ theme }) => theme.typography.Body_Small}
  line-height: 1;
  white-space: nowrap;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_200};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.WHITE : theme.colors.primary.BLACK};

  ${media.mobile} {
    padding: 0.5rem 0.85rem;
  }
`;

export const TypeGrid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
  margin: 0.875rem 0 1rem;

  ${media.mobile} {
    gap: 0.5rem;
    margin: 0.75rem 0 0.75rem;
  }
`;

export const TypeCard = styled.button<{ $selected: boolean }>`
  width: 52px;
  height: 52px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_200};
  border-radius: 6px;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_200};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary.WHITE : theme.colors.primary.BLACK};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }

  ${media.mobile} {
    width: 50px;
    height: 50px;
  }
`;

export const TypeLabel = styled.span`
  ${({ theme }) => theme.typography.Body_Small}
  font-size: 10px;
  line-height: 1;
`;

export const PreContentWrap = styled.div`
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  width: 100%;
  min-height: 100dvh;
  padding-bottom: 1rem;

  ${media.tablet} {
    padding: 1rem;
  }
`;
