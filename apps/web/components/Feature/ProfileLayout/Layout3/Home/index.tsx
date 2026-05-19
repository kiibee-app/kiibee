"use client";

import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import Hero from "../Hero";
import LastestUpload from "../../Layout2/Home/LastestUpload";
import { latestUploadDataLayout3 } from "@/utils/dummyData/lastestUpload.data";

export default function Home() {
  return (
    <CreateProfile1Layout>
      <Hero />
      <LastestUpload data={latestUploadDataLayout3} />
    </CreateProfile1Layout>
  );
}
