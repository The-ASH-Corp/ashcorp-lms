"use client";

import { useEffect } from "react";

import { useGetCurrentUserQuery } from "@/lib/redux/features/auth/authApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/auth/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return children;
}
