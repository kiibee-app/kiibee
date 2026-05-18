"use client";

import styled from "styled-components";
import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import Hero from "../Hero";
import { latestUploadDataLayout1 } from "@/utils/dummyData/lastestUpload.data";
import { HeroWrapper, ContentInner } from "../Hero/styles";
import LatestUpload from "../../Layout2/Home/LatestUpload";
import CollectionSections from "./CollectionSections";

const SectionWrapper = styled(HeroWrapper)`
  margin-top: 0;
  padding-top: 35px;
  background: transparent;
`;

const ContentAdjust = styled(ContentInner)`
  padding: 0 6px;
`;

export default function CreateProfile1Home() {
  return (
    <CreateProfile1Layout>
      <Hero />
      <SectionWrapper>
        <ContentAdjust>
          <LatestUpload data={latestUploadDataLayout1} />
          <CollectionSections />
        </ContentAdjust>
      </SectionWrapper>
    </CreateProfile1Layout>
  );
}
