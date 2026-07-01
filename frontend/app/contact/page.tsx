"use client";
import Hero from "@/components/contactUs/Hero";
import ContactCard from "@/components/contactUs/ContactCard";
import Institution from "@/components/contactUs/Institution";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import Faq from "@/components/contactUs/Faq";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        {/* Hero Section */}
        <Hero />

        {/* Contact Cards & Form */}
        <ContactCard />

        {/* Institutional Partnerships */}
        <Institution />

        {/* FAQ */}
        <Faq />
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
