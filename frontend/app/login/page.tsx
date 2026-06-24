"use client";

import { useState, type FormEvent } from "react";
import AuthLayout from "@/components/login/AuthLayout";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignUp) {
      console.log("Create account", {
        signupName,
        signupEmail,
        signupPhone,
        signupPassword,
        signupConfirmPassword,
      });
      return;
    }

    console.log("Login", { loginEmail, loginPassword, stayLoggedIn });
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
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      onToggleConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
      onToggleStayLoggedIn={() => setStayLoggedIn((prev) => !prev)}
      onToggleMode={() => setIsSignUp((prev) => !prev)}
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
