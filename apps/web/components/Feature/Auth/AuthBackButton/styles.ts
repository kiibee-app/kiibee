import Link from "next/link";
import styled from "styled-components";

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;
