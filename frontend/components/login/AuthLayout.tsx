"use client";

import Image from "next/image";
import AuthForm from "@/components/login/AuthForm";
import { AppLogo } from "@/components/ui/app-logo";
import { AuthFormValues } from "@/lib/validations/auth";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  isSignUp: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onToggleMode: () => void;
  onSubmit: (data: AuthFormValues) => void;
}

export default function AuthLayout({
  isSignUp,
  showPassword,
  showConfirmPassword,
  errorMessage,
  isSubmitting,
  onTogglePassword,
  onToggleConfirmPassword,
  onToggleMode,
  onSubmit,
}: AuthLayoutProps) {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="absolute inset-0">
          <Image
            src="/globe_hero.png"
            alt="Globe hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <AppLogo width={90} height={90} />
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight text-white lg:text-5xl">
            Ascend to your <span className="italic text-purple-400">Academic</span>
            <br />
            <span className="italic text-purple-400">Zenith.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300/80">
            Join an elite community of scholars and industry leaders. Access
            world-class courses designed for the visionaries of tomorrow.
          </p>
        </div>

        <p className="relative z-10 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          © 2026 Ash Academy. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-120 lg:shrink-0 lg:p-10">
        <AuthForm
          isSignUp={isSignUp}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onTogglePassword={onTogglePassword}
          onToggleConfirmPassword={onToggleConfirmPassword}
          onToggleMode={onToggleMode}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
