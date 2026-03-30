"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingState } from "./components/ui/LoadingState";
import { fetchCurrentUser } from "@/lib/auth";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/auth/success", "/"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      try {
        // Check authentication via JWT (API call)
        const user = await fetchCurrentUser();

        if (user) {
          // User is authenticated
          if (pathname === "/login" || pathname === "/") {
            // Redirect to dashboard if on public auth pages
            router.replace("/dashboard");
          } else {
            // Allow access to protected routes
            setIsChecking(false);
          }
        } else {
          // User is not authenticated
          if (!isPublicRoute) {
            // Redirect to login if trying to access protected route
            router.replace("/login");
          } else {
            // Allow access to public routes
            setIsChecking(false);
          }
        }
      } catch (error) {
        // Error checking auth (network issue, etc.)
        if (!isPublicRoute) {
          router.replace("/login");
        } else {
          setIsChecking(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Checking authentication..." />
      </main>
    );
  }

  return <>{children}</>;
}
