"use client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PrivacyPolicy from "@/components/privacyPolicy/PrivacyPolicy";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        <PrivacyPolicy />
        <Footer />
      </main>
    </>
  );
}
