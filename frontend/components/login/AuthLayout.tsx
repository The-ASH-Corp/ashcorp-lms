"use client";

import Image from "next/image";
import AuthForm from "@/components/login/AuthForm";

interface AuthLayoutProps {
  isSignUp: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  stayLoggedIn: boolean;
  loginEmail: string;
  loginPassword: string;
  signupName: string;
  signupEmail: string;
  signupPhone: string;
  signupPassword: string;
  signupConfirmPassword: string;
  errorMessage: string | null;
  isSubmitting: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onToggleStayLoggedIn: () => void;
  onToggleMode: () => void;
  onLoginEmailChange: (value: string) => void;
  onLoginPasswordChange: (value: string) => void;
  onSignupNameChange: (value: string) => void;
  onSignupEmailChange: (value: string) => void;
  onSignupPhoneChange: (value: string) => void;
  onSignupPasswordChange: (value: string) => void;
  onSignupConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AuthLayout({
  isSignUp,
  showPassword,
  showConfirmPassword,
  stayLoggedIn,
  loginEmail,
  loginPassword,
  signupName,
  signupEmail,
  signupPhone,
  signupPassword,
  signupConfirmPassword,
  errorMessage,
  isSubmitting,
  onTogglePassword,
  onToggleConfirmPassword,
  onToggleStayLoggedIn,
  onToggleMode,
  onLoginEmailChange,
  onLoginPasswordChange,
  onSignupNameChange,
  onSignupEmailChange,
  onSignupPhoneChange,
  onSignupPasswordChange,
  onSignupConfirmPasswordChange,
  onSubmit,
}: AuthLayoutProps) {
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
          <Image
            src="https://ashacademylms.com/storage/setting/logo/xrDvetmZgdczqHBL4GDygfTgdeyzPmZyq0Fa6Eo8.png"
            alt="Logo"
            width={90}
            height={90}
          />
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

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-background"
                >
                  <Image src={src} alt="student" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-white">+12k Students Joined</p>
              <p className="text-[11px] text-slate-400">Enrolled this semester</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          © 2026 Ash Academy. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-[480px] lg:shrink-0 lg:p-10">
        <AuthForm
          isSignUp={isSignUp}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          stayLoggedIn={stayLoggedIn}
          loginEmail={loginEmail}
          loginPassword={loginPassword}
          signupName={signupName}
          signupEmail={signupEmail}
          signupPhone={signupPhone}
          signupPassword={signupPassword}
          signupConfirmPassword={signupConfirmPassword}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onTogglePassword={onTogglePassword}
          onToggleConfirmPassword={onToggleConfirmPassword}
          onToggleStayLoggedIn={onToggleStayLoggedIn}
          onToggleMode={onToggleMode}
          onLoginEmailChange={onLoginEmailChange}
          onLoginPasswordChange={onLoginPasswordChange}
          onSignupNameChange={onSignupNameChange}
          onSignupEmailChange={onSignupEmailChange}
          onSignupPhoneChange={onSignupPhoneChange}
          onSignupPasswordChange={onSignupPasswordChange}
          onSignupConfirmPasswordChange={onSignupConfirmPasswordChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
