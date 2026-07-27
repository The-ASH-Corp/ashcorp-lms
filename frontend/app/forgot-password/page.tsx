"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  forgotPasswordRequestSchema,
  ForgotPasswordRequestFormData,
  resetPasswordWithOtpSchema,
  ResetPasswordWithOtpFormData,
} from "@/lib/validations/auth";
import {
  useRequestPasswordResetOtpMutation,
  useResetPasswordWithOtpMutation,
} from "@/lib/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestPasswordResetOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordWithOtpMutation();

  const requestForm = useForm<ForgotPasswordRequestFormData>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordWithOtpFormData>({
    resolver: zodResolver(resetPasswordWithOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleRequestOtp = async (data: ForgotPasswordRequestFormData) => {
    setErrorMessage(null);

    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      await requestOtp({ email: normalizedEmail }).unwrap();
      setEmail(normalizedEmail);
      setOtpSent(true);
      resetForm.setValue("email", normalizedEmail);
      toast.success("If your email exists, OTP has been sent.");
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleResetPassword = async (data: ResetPasswordWithOtpFormData) => {
    setErrorMessage(null);

    try {
      await resetPassword({
        email: data.email.trim().toLowerCase(),
        otp: data.otp.trim(),
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      toast.success("Password reset successful. Please login.");
      resetForm.reset();
      requestForm.reset();
      setEmail("");
      setOtpSent(false);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background">
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
            onClick={handleLogoClick}
            className="cursor-pointer"
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

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-120 lg:shrink-0 lg:p-10">
        <div className="w-full max-w-100 rounded-2xl bg-card p-8 ring-1 ring-border shadow-2xl shadow-black/60">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {otpSent
                ? "Enter your OTP and set your new password."
                : "Enter your registered email to receive an OTP."}
            </p>
          </div>

          {!otpSent ? (
            <form className="space-y-5" onSubmit={requestForm.handleSubmit(handleRequestOtp)}>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="forgot-email"
                    type="email"
                    {...requestForm.register("email")}
                    placeholder="name@example.com"
                    className="w-full rounded-xl bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                  />
                </div>
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{requestForm.formState.errors.email.message}</p>
                )}
              </div>

              {errorMessage && (
                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 ring-1 ring-red-500/20">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isRequestingOtp}
                className="w-full rounded-xl bg-purple-600 py-6 text-sm border-none font-semibold text-white shadow-lg shadow-purple-600/40 transition hover:bg-purple-700 hover:shadow-purple-600/50"
              >
                {isRequestingOtp ? <Spinner /> : "Send OTP"}
                {!isRequestingOtp && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={resetForm.handleSubmit(handleResetPassword)}>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  readOnly
                  {...resetForm.register("email")}
                  className="w-full rounded-xl bg-input/70 py-3 px-4 text-sm text-muted-foreground outline-none ring-1 ring-border"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  OTP
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    {...resetForm.register("otp")}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                  />
                </div>
                {resetForm.formState.errors.otp && (
                  <p className="text-xs text-red-400">{resetForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    {...resetForm.register("newPassword")}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-input py-3 pl-10 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-400">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...resetForm.register("confirmPassword")}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-input py-3 pl-10 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none ring-1 ring-border transition focus:ring-sidebar-primary/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-400">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {errorMessage && (
                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 ring-1 ring-red-500/20">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isResettingPassword}
                className="w-full rounded-xl bg-purple-600 py-6 text-sm border-none font-semibold text-white shadow-lg shadow-purple-600/40 transition hover:bg-purple-700 hover:shadow-purple-600/50"
              >
                {isResettingPassword ? <Spinner /> : "Reset Password"}
                {!isResettingPassword && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                disabled={isRequestingOtp}
                onClick={requestForm.handleSubmit(handleRequestOtp)}
              >
                {isRequestingOtp ? <Spinner /> : "Resend OTP"}
              </Button>

              <p className="text-xs text-muted-foreground">
                OTP sent to <span className="font-medium text-foreground">{email}</span>. Check spam folder if needed.
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-foreground transition hover:text-purple-600">
              Back to Login
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Go to login page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
