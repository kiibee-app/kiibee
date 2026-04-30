import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const Wrapper = styled.section`
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  padding: 30px 24px 96px;
  background: transparent;
`;

export const BackButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
`;

export const Title = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-top: 45px;
`;

export const Description = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  max-width: 330px;
  margin: 0.5rem 0 1rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;

  button {
    width: 100%;
    margin-top: 2rem;
  }
`;

export const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const ResendText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 1rem;
`;

export const LinkButton = styled(MonoText).attrs({
  $use: "Body_Bold",
})`
  display: inline;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`;
