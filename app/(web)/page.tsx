import CarListing from "./_components/carlisting-section";
import HeroSection from "./_components/hero-section";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-background">
      <HeroSection />
      <CarListing />
    </main>
  );
}
