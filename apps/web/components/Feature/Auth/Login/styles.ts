import styled from "styled-components";

export const PageLayout = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  gap: 0;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const FormPanel = styled.section`
  flex: 6;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;

  @media (max-width: 900px) {
    padding: 2rem 1rem;
  }
`;

export const SlidePanel = styled.section`
  flex: 0 0 550px;
  max-width: 550px;
  background: ${({ theme }) => theme.colors.gredint.DEEP_GREEN};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 241px 85.178px 96.491px 85px;
  border-radius: 0 0 0 0;
  position: relative;

  @media (max-width: 900px) {
    width: 100%;
    flex: 0 0 auto;
    padding: 2.5rem 1.5rem;
  }
`;
