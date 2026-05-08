"use client";

import CreateProfileLayout from "../CreateProfileHome/CreateProfileLayout";
import CreateProfileHeroFrame from "../CreateProfileHero";
import CollectionList from "./ColletionList";

export default function CreateProfileCollections() {
  return (
    <CreateProfileLayout>
      <CreateProfileHeroFrame />
      <CollectionList />
    </CreateProfileLayout>
  );
}
