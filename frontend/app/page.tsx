
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ExploreCategories from "@/components/landing/ExploreCategories";
import TrendingWorkshops from "@/components/landing/TrendingWorkshops";
import Stats from "@/components/landing/Stats";
import Partners from "@/components/landing/Partners";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ExploreCategories />
        <TrendingWorkshops />
        <Stats />
        <Partners />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
