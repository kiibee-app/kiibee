"use client";

import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import Hero from "../Hero";
import { latestUploadDataLayout3 } from "@/utils/dummyData/lastestUpload.data";
import LatestUpload from "../../Layout2/Home/LatestUpload";

export default function Home() {
  return (
    <CreateProfile1Layout>
      <Hero />
      <LatestUpload data={latestUploadDataLayout3} />
    </CreateProfile1Layout>
  );
}
