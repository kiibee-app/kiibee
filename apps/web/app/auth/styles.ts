import COLORS from "@repo/ui/colors";
import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Main = styled.main`
  flex: 1;
  width: 100%;
  background: ${({ theme }) =>
    theme?.colors?.primary?.WHITE ?? COLORS.primary.WHITE};
`;
