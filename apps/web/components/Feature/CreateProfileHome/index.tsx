"use client";

import CreateProfile2Hero from "../CreateProfile2Hero";
import CreateProfileLayout from "../../Layout/CreateProfile";
import LastestUpload from "./LastestUpload";

export default function CreateProfileHome() {
  return (
    <CreateProfileLayout>
      <CreateProfile2Hero />
      <LastestUpload />
    </CreateProfileLayout>
  );
}
