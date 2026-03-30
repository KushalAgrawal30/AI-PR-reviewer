"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/app/components/ui/LoadingState";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // After OAuth callback, backend should have set JWT cookie
    // Just redirect to dashboard and let AuthGuard validate
    const error = searchParams.get("error");
    
    if (error) {
      // If there's an auth error, go back to login
      router.replace("/login");
      return;
    }

    // Success - redirect to dashboard
    // JWT cookie should already be set by backend
    router.replace("/dashboard");
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <LoadingState message="Signing you in..." />
    </main>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading..." />
      </main>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}