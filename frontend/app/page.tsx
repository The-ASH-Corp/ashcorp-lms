
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ExploreCategories from "@/components/landing/ExploreCategories";
import TrendingWorkshops from "@/components/landing/TrendingWorkshops";
import Stats from "@/components/landing/Stats";
import Partners from "@/components/landing/Graduates";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ScrollReveal delay={0.05}>
          <ExploreCategories />
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <TrendingWorkshops />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Stats />
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <Partners />
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <Testimonials />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
