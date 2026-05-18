"use client";

import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import CollectionList from "../../Layout2/Collections/CollectionList";
import Hero from "../Hero";

export default function Collections() {
  return (
    <CreateProfile1Layout>
      <Hero />
      <CollectionList />
    </CreateProfile1Layout>
  );
}
