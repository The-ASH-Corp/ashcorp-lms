"use client";

import { useState } from "react";
import AuthLayout from "@/components/login/AuthLayout";
import { useLoginMutation, useRegisterMutation } from "@/lib/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/lib/utils";
import { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const handleFormSubmit = async (data: LoginFormData | RegisterFormData) => {
    setErrorMessage(null);

    if (isSignUp) {
      try {
        await register(data as RegisterFormData).unwrap();
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      }
      return;
    }

    try {
      await login(data as LoginFormData).unwrap();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      isSignUp={isSignUp}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      errorMessage={errorMessage}
      isSubmitting={isLoggingIn || isRegistering}
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      onToggleConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
      onToggleMode={() => {
        setErrorMessage(null);
        setIsSignUp((prev) => !prev);
      }}
      onSubmit={handleFormSubmit}
    />
  );
}
