"use client";

import CreateProfileLayout from "../../Layout/CreateProfile";
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
