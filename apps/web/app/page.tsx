import HeroSection from "@/components/landing/hero";
import NavBar from "@/components/Layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      <NavBar />
      <main className="flex flex-1 w-full items-center justify-center">
        <HeroSection />
      </main>
    </div>
  );
}
