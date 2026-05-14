"use client";

import CreateProfile2Hero from "../CreateProfile2Hero";
import CreateProfileLayout from "../../Layout/CreateProfile";
import LastestUpload from "./LastestUpload";
import CreateProfile2AboutSection from "../CreateProfile2About/CreateProfile2AboutSection";

export default function CreateProfileHome() {
  return (
    <CreateProfileLayout>
      <CreateProfile2Hero />
      <LastestUpload />
      <CreateProfile2AboutSection />
    </CreateProfileLayout>
  );
}
