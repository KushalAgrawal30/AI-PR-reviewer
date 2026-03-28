"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingState } from "./components/ui/LoadingState";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/auth/success", "/"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Get user from localStorage
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.replace("/login");
      return;
    }

    if (storedUser) {
      try {
        // Validate the stored user data
        const user = JSON.parse(storedUser);
        if (user && user.id && user.githubLogin) {
          setIsAuthenticated(true);
          
          // If authenticated and on login/home, redirect to dashboard
          if (pathname === "/login" || pathname === "/") {
            router.replace("/dashboard");
            return;
          }
        } else {
          // Invalid user data, clear and redirect
          localStorage.removeItem("loggedInUser");
          if (!isPublicRoute) {
            router.replace("/login");
            return;
          }
        }
      } catch (error) {
        // Invalid JSON, clear and redirect
        localStorage.removeItem("loggedInUser");
        if (!isPublicRoute) {
          router.replace("/login");
          return;
        }
      }
    }

    // If on public route and not authenticated, allow access
    if (isPublicRoute) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(!!storedUser);
    }
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Checking authentication..." />
      </main>
    );
  }

  return <>{children}</>;
}
