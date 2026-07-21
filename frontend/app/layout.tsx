import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "@/lib/redux/provider";
import { Toaster } from "@/components/ui/sonner"
import AuthProvider from "@/components/login/AuthProvider";
import Script from "next/script";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AshCorp Learning Management System",
  description: "Empowering Growth through Knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <Toaster richColors position="top-right"/>
        <ReduxProvider><AuthProvider>{children}</AuthProvider></ReduxProvider>
      </body>
    </html>
  );
}
