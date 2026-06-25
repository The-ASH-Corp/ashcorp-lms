"use client";

import { useState, type FormEvent } from "react";
import AuthLayout from "@/components/login/AuthLayout";
import { useLoginMutation, useRegisterMutation } from "@/lib/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/lib/utils";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (isSignUp) {
      if (signupPassword !== signupConfirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      try {
        await register({
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
          password_confirmation: signupConfirmPassword,
        }).unwrap();
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      }

      return;
    }

    try {
      await login({
        email: loginEmail,
        password: loginPassword,
        remember: stayLoggedIn,
      }).unwrap();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  };

  return (
    <AuthLayout
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
      isSubmitting={isLoggingIn || isRegistering}
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      onToggleConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
      onToggleStayLoggedIn={() => setStayLoggedIn((prev) => !prev)}
      onToggleMode={() => {
        setErrorMessage(null);
        setIsSignUp((prev) => !prev);
      }}
      onLoginEmailChange={(value) => setLoginEmail(value)}
      onLoginPasswordChange={(value) => setLoginPassword(value)}
      onSignupNameChange={(value) => setSignupName(value)}
      onSignupEmailChange={(value) => setSignupEmail(value)}
      onSignupPhoneChange={(value) => setSignupPhone(value)}
      onSignupPasswordChange={(value) => setSignupPassword(value)}
      onSignupConfirmPasswordChange={(value) => setSignupConfirmPassword(value)}
      onSubmit={handleSubmit}
    />
  );
}
