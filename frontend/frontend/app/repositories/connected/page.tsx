"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { LoadingState } from "@/app/components/ui/LoadingState";
import { EmptyState } from "@/app/components/ui/EmptyState";

type LoggedInUser = {
  id: number;
  githubLogin: string;
  name: string;
  avatarUrl: string;
};

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

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [repos, setRepos] = useState<ConnectedRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: LoggedInUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchConnectedRepos(parsedUser.id);
    } catch {
      localStorage.removeItem("loggedInUser");
      router.replace("/login");
    }
  }, [router]);

  const fetchConnectedRepos = async (userId: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/user/${userId}`
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading connected repositories..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => router.push("/repositories")}>
            Back to All Repositories
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Connected Repositories"
          description={user ? `Connected repositories for @${user.githubLogin}` : "Repositories actively connected to AI PR Reviewer"}
          actions={
            <>
              <Button onClick={() => router.push("/dashboard")} variant="secondary">
                Dashboard
              </Button>
              <Button onClick={() => router.push("/repositories")} variant="secondary">
                All Repositories
              </Button>
            </>
          }
        />

        {repos.length === 0 ? (
          <Card>
            <EmptyState
              title="No connected repositories"
              description="Connect a repository to start reviewing pull requests with AI."
              action={
                <Button 
                  onClick={() => router.push("/repositories")} 
                  variant="primary"
                >
                  Connect Your First Repository
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {repos.map((repo) => (
              <Card key={repo.id} hover>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-base sm:text-lg font-semibold text-white break-all">
                        {repo.fullName}
                      </h2>
                      <StatusBadge 
                        status={repo.isPrivate ? "Private" : "Public"} 
                        variant={repo.isPrivate ? "warning" : "default"}
                      />
                    </div>
                    <p className="text-[#8b8b8b] text-sm font-mono break-all">ID: {repo.githubRepoId}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <StatusBadge status={repo.active ? "Active" : "Inactive"} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                  <div>
                    <span className="text-[#6b6b6b]">Owner:</span>{" "}
                    <span className="text-[#a1a1a1] break-all">{repo.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[#6b6b6b]">Repository:</span>{" "}
                    <span className="text-[#a1a1a1] break-all">{repo.repoName}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#6b6b6b]">Installation ID:</span>{" "}
                    <span className="text-[#a1a1a1] font-mono">{repo.installationId}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1a1a1a]">
                  <Link href={`/repositories/${encodeURIComponent(repo.fullName)}`}>
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      View Review Jobs
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}