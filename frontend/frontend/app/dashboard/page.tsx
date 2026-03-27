"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { LoadingState } from "@/app/components/ui/LoadingState";

type LoggedInUser = {
  id: number;
  githubLogin: string;
  name: string;
  avatarUrl: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: LoggedInUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem("loggedInUser");
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.replace("/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading dashboard..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl">
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.githubLogin}
                  className="h-16 w-16 rounded-full border border-[#252525] object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full border border-[#252525] bg-[#151515]" />
              )}

              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {user.name || user.githubLogin}
                </h1>
                <p className="text-[#8b8b8b] text-sm">@{user.githubLogin}</p>
                <p className="text-[#6b6b6b] text-xs font-mono mt-1">ID: {user.id}</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </Card>

        <PageHeader
          title="Dashboard"
          description="Manage your repositories and review AI-generated PR analysis"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/review-job" className="group">
            <Card hover className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#151515] border border-[#2a2a2a] rounded-lg group-hover:border-[#3a3a3a] transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                    Review Jobs
                  </h2>
                  <p className="text-[#8b8b8b] text-sm">
                    View all AI pull request review jobs and findings
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/repositories" className="group">
            <Card hover className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#151515] border border-[#2a2a2a] rounded-lg group-hover:border-[#3a3a3a] transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                    Repositories
                  </h2>
                  <p className="text-[#8b8b8b] text-sm">
                    Select and manage repositories connected to your account
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}