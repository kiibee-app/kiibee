"use client";

import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import Hero from "../Hero";
import CollectionList from "@/components/Feature/ProfileLayout/shared/CollectionList";

export default function Collections() {
  return (
    <CreateProfile1Layout>
      <Hero />
      <CollectionList />
    </CreateProfile1Layout>
  );
}
