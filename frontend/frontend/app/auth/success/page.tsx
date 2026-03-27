"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/app/components/ui/LoadingState";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    const githubLogin = searchParams.get("githubLogin");
    const name = searchParams.get("name");
    const avatarUrl = searchParams.get("avatarUrl");

    if (!id || !githubLogin) {
      router.replace("/login");
      return;
    }

    const user = {
      id: Number(id),
      githubLogin,
      name: name || "",
      avatarUrl: avatarUrl || "",
    };

    localStorage.setItem("loggedInUser", JSON.stringify(user));
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