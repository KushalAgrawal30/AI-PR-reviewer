"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/auth";
import { LoadingState } from "./components/ui/LoadingState";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading..." />
      </main>
    );
  }

  return null;
}
