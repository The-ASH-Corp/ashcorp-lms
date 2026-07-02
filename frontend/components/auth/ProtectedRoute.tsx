"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { type AuthRole } from "@/lib/auth/navigation";

export default function ProtectedRoute({
  children,
  requiredRole,
  unauthorizedRedirect,
  unauthenticatedRedirect = "/login",
}: {
  children: React.ReactNode;
  requiredRole: AuthRole;
  unauthorizedRedirect: string;
  unauthenticatedRedirect?: string;
}) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!user) {
      router.replace(unauthenticatedRedirect);
      return;
    }

    if (user.role !== requiredRole) {
      router.replace(unauthorizedRedirect);
    }
  }, [
    mounted,
    requiredRole,
    router,
    unauthorizedRedirect,
    unauthenticatedRedirect,
    user,
  ]);

  if (!mounted || !user || user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
