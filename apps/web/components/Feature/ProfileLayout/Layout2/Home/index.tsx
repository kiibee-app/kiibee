"use client";

import CreateProfileLayout from "../../../../Layout/CreateProfile2";
import LastestUpload from "./LastestUpload";
import Hero from "../Hero";
import AboutSection from "../About/AboutSection";

export default function Home() {
  return (
    <CreateProfileLayout>
      <Hero />
      <LastestUpload />
      <AboutSection />
    </CreateProfileLayout>
  );
}
