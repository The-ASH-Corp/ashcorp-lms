"use client";

import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
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

export default function AuthForm({
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
}: AuthFormProps) {
  return (
    <div className="w-full max-w-[400px] rounded-2xl bg-card p-8 ring-1 ring-border shadow-2xl shadow-black/60">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignUp
            ? "Join our elite community of scholars."
            : "Enter your credentials to access your dashboard."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        {!isSignUp ? (
          <>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(event) => onLoginEmailChange(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-muted-foreground transition hover:text-sidebar-primary"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(event) => onLoginPasswordChange(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <div
                className={`relative flex h-4.5 w-4.5 items-center justify-center rounded border transition ${
                  stayLoggedIn
                    ? "border-sidebar-primary bg-sidebar-primary"
                    : "border-border bg-transparent"
                }`}
                onClick={onToggleStayLoggedIn}
              >
                {stayLoggedIn && (
                  <svg className="h-2.5 w-2.5 text-sidebar-primary-foreground" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-muted-foreground">Stay logged in for 30 days</span>
            </label>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-name"
                  type="text"
                  value={signupName}
                  onChange={(event) => onSignupNameChange(event.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(event) => onSignupEmailChange(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={signupPhone}
                  onChange={(event) => onSignupPhoneChange(event.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(event) => onSignupPasswordChange(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupConfirmPassword}
                  onChange={(event) => onSignupConfirmPasswordChange(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-input py-3 pl-10 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                />
                <button
                  type="button"
                  onClick={onToggleConfirmPassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        <Button
          id={isSignUp ? "signup-submit-btn" : "login-submit-btn"}
          type="submit"
          className="w-full rounded-xl bg-purple-600 py-6 text-sm border-none font-semibold text-white shadow-lg shadow-purple-600/40 transition hover:bg-purple-700 hover:shadow-purple-600/50"
        >
          {isSignUp ? "Create Account" : "Login"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account? " : "New to the academy? "}
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-foreground transition hover:text-purple-600"
        >
          {isSignUp ? "Login" : "Create an Account"}
        </button>
      </p>
    </div>
  );
}
