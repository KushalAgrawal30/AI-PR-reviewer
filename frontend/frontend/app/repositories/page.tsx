"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCurrentUser, CurrentUser } from "@/lib/auth";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { LoadingState } from "@/app/components/ui/LoadingState";
import { EmptyState } from "@/app/components/ui/EmptyState";

type UserRepositoryView = {
  githubRepoId: number;
  name: string;
  fullName: string;
  ownerName: string;
  isPrivate: boolean;
  installationId: number | null;
  connected: boolean;
};

export default function RepositoriesPage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [allRepos, setAllRepos] = useState<UserRepositoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
          setError("Unable to load user data");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/github/user/${currentUser.id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();
        setAllRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleInstallApp = () => {
    setInstalling(true);
    window.location.href = "https://github.com/apps/pr-review-ai/installations/new";
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <LoadingState message="Loading repositories..." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <EmptyState
            title="Error loading repositories"
            description={error}
            action={
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="All Repositories"
          description={
            user
              ? `Manage GitHub repositories for @${user.githubLogin}`
              : "Manage your GitHub repositories"
          }
          actions={
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={() => router.push("/repositories/connected")}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Connected Repos
              </Button>
              <Button
                onClick={handleInstallApp}
                disabled={installing}
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {installing ? "Redirecting..." : "Connect New"}
              </Button>
            </div>
          }
        />

        {allRepos.length === 0 ? (
          <EmptyState
            title="No repositories found"
            description="Connect your first GitHub repository to start using AI-powered PR reviews."
            action={
              <Button onClick={handleInstallApp} disabled={installing}>
                Connect Repository
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {allRepos.map((repo) => (
              <Card key={repo.githubRepoId}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Repository Icon */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#151515] border border-[#252525] rounded-lg">
                        <svg
                          className="w-5 h-5 text-white"
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
                    </div>

                    {/* Repository Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white break-words">
                          {repo.fullName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge
                            status={repo.connected ? "Connected" : "Not Connected"}
                          />
                          <StatusBadge
                            status={repo.isPrivate ? "Private" : "Public"}
                            variant={repo.isPrivate ? "warning" : "info"}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#8b8b8b]">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="break-words">{repo.ownerName}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          <span className="break-words">{repo.name}</span>
                        </span>
                        {repo.installationId !== null && (
                          <span className="flex items-center gap-1 text-[#6b6b6b]">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                              />
                            </svg>
                            ID: {repo.installationId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {repo.connected && (
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <Link href={`/repositories/${encodeURIComponent(repo.fullName)}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          View Reviews
                          <svg
                            className="w-4 h-4 ml-2"
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
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {allRepos.length > 0 && (
          <Card className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {allRepos.length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Total Repos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-500">
                  {allRepos.filter((r) => r.connected).length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-500">
                  {allRepos.filter((r) => r.isPrivate).length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Private</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500">
                  {allRepos.filter((r) => !r.isPrivate).length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Public</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}