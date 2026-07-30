"use client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TermsConditions from "@/components/termsConditions/TermsConditions";

export default function TermsConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        <TermsConditions />
        <Footer />
      </main>
    </>
  );
}
