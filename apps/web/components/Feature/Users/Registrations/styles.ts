import styled from "styled-components";

export {
  EmptySectionDescription,
  EmptySectionHeader,
  EmptySectionTitle,
  SectionCard,
  SectionDescription,
  SectionTitle,
  TableSection,
} from "../shared/styles";

export const DeleteActionButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  font-size: 16px;
  line-height: 1;
`;
