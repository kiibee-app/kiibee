"use client";

import styled from "styled-components";
import SafeImage from "./SafeImage";

const CoverImage = styled(SafeImage)`
  object-fit: cover;
  object-position: center;
`;

export default CoverImage;
