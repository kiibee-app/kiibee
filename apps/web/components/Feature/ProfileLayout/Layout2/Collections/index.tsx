"use client";

import CreateProfileLayout from "../../../../Layout/CreateProfile2";
import Hero from "../Hero";
import CollectionList from "./ColletionList";

export default function Collections() {
  return (
    <CreateProfileLayout>
      <Hero />
      <CollectionList />
    </CreateProfileLayout>
  );
}
