"use client";

import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import CreateProfile1Hero from "../CreateProfile1Hero";
import CollectionList from "../CreateProfile2Collections/ColletionList";

export default function CreateProfile1Collections() {
  return (
    <CreateProfile1Layout>
      <CreateProfile1Hero />
      <CollectionList />
    </CreateProfile1Layout>
  );
}
