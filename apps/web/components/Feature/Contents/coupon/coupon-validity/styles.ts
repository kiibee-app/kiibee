import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import {
  ModalContent as BaseModalContent,
  FormShell as BaseFormShell,
} from "../styles";

export const TitleHelperText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${COLORS.neutral.GRAY};
  text-align: center;
  margin-bottom: 24px;
`;

export const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalContent = styled(BaseModalContent)`
  flex: 1;
  min-height: unset;
  padding-top: 25px;
`;

export const FormShell = styled(BaseFormShell)`
  flex: 1;
  min-height: unset;
`;
