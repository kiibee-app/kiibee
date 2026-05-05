import { MonoText } from "@/components/UI/Monotext";
import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
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
    margin-top: 1.5rem;
  }
`;

export const FormMessage = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${({ theme }) => theme.colors.system?.ERROR ?? "#b42318"};
  text-align: left;
`;

export const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;
