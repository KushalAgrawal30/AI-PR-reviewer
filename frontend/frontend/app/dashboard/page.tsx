"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCurrentUser, CurrentUser } from "@/lib/auth";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { LoadingState } from "@/app/components/ui/LoadingState";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/github/logout`, {
      method: "POST",
      credentials: "include",
    });

    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <LoadingState message="Loading dashboard..." />
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* User Profile Section */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name || user.githubLogin}
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-[#252525] flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
                  {user.name || user.githubLogin}
                </h1>
                <p className="text-[#8b8b8b] text-sm sm:text-base break-words">
                  @{user.githubLogin}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto flex-shrink-0"
            >
              Logout
            </Button>
          </div>
        </Card>

        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="Manage your repositories and review jobs"
        />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* All Repositories Card */}
          <Link href="/repositories" className="block">
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#151515] border border-[#252525] rounded-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-5 h-5 text-[#6b6b6b] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    All Repositories
                  </h2>
                  <p className="text-[#8b8b8b] text-sm">
                    View and manage all your GitHub repositories. Connect new repos to enable AI-powered reviews.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Connected Repositories Card */}
          <Link href="/repositories/connected" className="block">
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#151515] border border-[#252525] rounded-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-5 h-5 text-[#6b6b6b] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    Connected Repos
                  </h2>
                  <p className="text-[#8b8b8b] text-sm">
                    View repositories with active AI review integration. Monitor review jobs and activity.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Review Jobs Card */}
          <Link href="/review-job" className="block">
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#151515] border border-[#252525] rounded-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-5 h-5 text-[#6b6b6b] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    Review Jobs
                  </h2>
                  <p className="text-[#8b8b8b] text-sm">
                    View all AI pull request reviews. Track status, findings, and review history across all repos.
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