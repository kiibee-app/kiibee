"use client";

import CreateProfileLayout from "../../Layout/CreateProfile2";
import CreateProfileHeroFrame from "../CreateProfile2Hero";
import CollectionList from "./ColletionList";

export default function CreateProfileCollections() {
  return (
    <CreateProfileLayout>
      <CreateProfileHeroFrame />
      <CollectionList />
    </CreateProfileLayout>
  );
}
