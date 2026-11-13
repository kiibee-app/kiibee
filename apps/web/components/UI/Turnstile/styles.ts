import styled from "styled-components";

export const VerificationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
`;

export const VerificationWidget = styled.div`
  width: 100%;
  max-width: 360px;
  min-height: 65px;
  display: flex;
  justify-content: center;

  iframe {
    display: block;
    border-radius: 8px;
    margin: 0 auto;
  }
`;

export const VerificationStatus = styled.p`
  ${({ theme }) => theme.typography.Body_Regular};
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary.GREEN_50};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-align: center;
  width: 100%;
  max-width: 360px;
`;
