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

type ConnectedRepository = {
  id: number;
  githubRepoId: number;
  repoName: string;
  ownerName: string;
  fullName: string;
  installationId: number;
  active: boolean;
  isPrivate: boolean;
};

export default function ConnectedRepositoriesPage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [repos, setRepos] = useState<ConnectedRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/user`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch connected repositories");
        }

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <LoadingState message="Loading connected repositories..." />
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
          title="Connected Repositories"
          description={
            user
              ? `Active AI review integrations for @${user.githubLogin}`
              : "Repositories with active AI review integration"
          }
          actions={
            <Button
              onClick={() => router.push("/repositories")}
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              All Repositories
            </Button>
          }
        />

        {repos.length === 0 ? (
          <EmptyState
            title="No connected repositories"
            description="You haven't connected any repositories yet. Connect a repository to enable AI-powered PR reviews."
            action={
              <Button onClick={() => router.push("/repositories")}>
                Browse Repositories
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {repos.map((repo) => (
              <Card key={repo.id} hover>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Repository Icon */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#151515] border border-[#252525] rounded-lg">
                        <svg
                          className="w-5 h-5 text-emerald-500"
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
                    </div>

                    {/* Repository Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white break-words">
                          {repo.fullName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge
                            status={repo.active ? "Active" : "Inactive"}
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
                          <span className="break-words">{repo.repoName}</span>
                        </span>
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
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <Link href={`/repositories/${encodeURIComponent(repo.fullName)}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        View Review Jobs
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
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {repos.length > 0 && (
          <Card className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-500">
                  {repos.length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-500">
                  {repos.filter((r) => r.active).length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-500">
                  {repos.filter((r) => r.isPrivate).length}
                </div>
                <div className="text-sm text-[#8b8b8b] mt-1">Private</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500">
                  {repos.filter((r) => !r.isPrivate).length}
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