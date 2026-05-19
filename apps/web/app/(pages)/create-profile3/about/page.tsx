import CreateProfile1Layout from "@/components/Layout/CreateProfile1";
import Hero from "@/components/Feature/ProfileLayout/Layout3/Hero";
import AboutSection from "@/components/Feature/ProfileLayout/Layout2/About/AboutSection";

export default function AboutPage() {
  return (
    <CreateProfile1Layout>
      <Hero />
      <AboutSection />
    </CreateProfile1Layout>
  );
}
