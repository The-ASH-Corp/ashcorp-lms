"use client";

import { useEffect, useState } from "react";
import AuthLayout from "@/components/login/AuthLayout";
import { useGetCurrentUserQuery, useLoginMutation, useRegisterMutation } from "@/lib/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/lib/utils";
import { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/auth/authSlice";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const dispatch = useAppDispatch();

   const { data, isLoading } = useGetCurrentUserQuery();
  
    useEffect(() => {
      if (data) {
        dispatch(
          setCredentials({
            user: data,
            token: null,
          }),
        );
      }
    }, [data, dispatch]);
  
    if (isLoading) {
      return null;
    }

  const handleFormSubmit = async (data: LoginFormData | RegisterFormData) => {
    setErrorMessage(null);

    if (isSignUp) {
      try {
        await register(data as RegisterFormData).unwrap();
        router.push("/");
        toast.success("Registration successful! Please log in.");
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      }
      return;
    }

    try {
      const res = await login(data as LoginFormData).unwrap();
      if(res.user?.role === "admin"){
        router.push("/admin");
      }
      else{
        router.push("/");
      }
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
