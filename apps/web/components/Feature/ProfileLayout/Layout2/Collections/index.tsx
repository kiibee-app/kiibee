"use client";

import CreateProfileLayout from "@/components/Layout/CreateProfile2";
import Hero from "../Hero";
import CollectionList from "@/components/Feature/ProfileLayout/shared/CollectionList";

export default function Collections() {
  return (
    <CreateProfileLayout>
      <Hero />
      <CollectionList />
    </CreateProfileLayout>
  );
}
