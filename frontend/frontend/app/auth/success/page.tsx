"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccessPage() {
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
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Signing you in...</h1>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </main>
  );
}