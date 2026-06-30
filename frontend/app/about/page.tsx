import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/about/Hero";
import About from "@/components/about/About";
import Pillars from "@/components/about/Pillars";
import Team from "@/components/about/Team";
import Stats from "@/components/about/Stats";


export default function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        {/* Hero */}
          <Hero/>
        {/* About */}
          <About/>
        {/* Pillars */}
          <Pillars/>
        {/* Team */}
          <Team/>
        {/* Stats + CTA */}
          <Stats/>
        {/* Footer */}
          <Footer />
      </main>
    </>
  );
}
