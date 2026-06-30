import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProtectedNavbar from "@/components/landing/ProtectedNavbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ProtectedNavbar />
      {children}
    </ProtectedRoute>
  );
}
