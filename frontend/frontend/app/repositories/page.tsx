"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type UserRepositoryView = {
  githubRepoId: number;
  name: string;
  fullName: string;
  ownerName: string;
  isPrivate: boolean;
  installationId: number | null;
  connected: boolean;
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

export default function RepositoriesPage() {
  const router = useRouter();

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [allRepos, setAllRepos] = useState<UserRepositoryView[]>([]);
  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: LoggedInUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchData(parsedUser.id);
    } catch {
      localStorage.removeItem("loggedInUser");
      router.replace("/login");
    }
  }, [router]);

  const fetchData = async (userId: number) => {
    try {
      setLoading(true);
      setError("");

      const [allReposResponse, connectedReposResponse] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/github/user/${userId}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/user/${userId}`
        ),
      ]);

      if (!allReposResponse.ok) {
        throw new Error("Failed to fetch GitHub repositories");
      }

      if (!connectedReposResponse.ok) {
        throw new Error("Failed to fetch connected repositories");
      }

      const allReposData = await allReposResponse.json();
      const connectedReposData = await connectedReposResponse.json();

      setAllRepos(allReposData);
      setConnectedRepos(connectedReposData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInstallApp = () => {
    if (!user) return;

    setInstalling(true);
    window.location.href = "https://github.com/apps/pr-review-ai/installations/new";
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading repositories..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Repositories"
          description={user ? `Repositories for @${user.githubLogin}` : ""}
          actions={
            <>
              <Button
                onClick={handleInstallApp}
                disabled={installing}
                variant="primary"
              >
                {installing ? "Redirecting..." : "Connect Repository"}
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="secondary"
              >
                Back to Dashboard
              </Button>
            </>
          }
        />

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">All GitHub Repositories</h2>

          {allRepos.length === 0 ? (
            <Card>
              <EmptyState
                title="No repositories found"
                description="We couldn't find any repositories in your GitHub account."
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {allRepos.map((repo) => (
                <Card key={repo.githubRepoId} hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{repo.fullName}</h3>
                        <StatusBadge 
                          status={repo.isPrivate ? "Private" : "Public"} 
                          variant={repo.isPrivate ? "warning" : "default"}
                        />
                      </div>
                      <p className="text-[#8b8b8b] text-sm font-mono">ID: {repo.githubRepoId}</p>
                    </div>

                    <StatusBadge status={repo.connected ? "Connected" : "Not Connected"} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-[#6b6b6b]">Owner:</span>{" "}
                      <span className="text-[#a1a1a1]">{repo.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6b6b]">Name:</span>{" "}
                      <span className="text-[#a1a1a1]">{repo.name}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6b6b]">Installation ID:</span>{" "}
                      <span className="text-[#a1a1a1] font-mono">
                        {repo.installationId !== null ? repo.installationId : "Not available"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Connected Repositories</h2>

          {connectedRepos.length === 0 ? (
            <Card>
              <EmptyState
                title="No connected repositories"
                description="Connect a repository to start reviewing pull requests with AI."
                action={
                  <Button onClick={handleInstallApp} variant="primary">
                    Connect Your First Repository
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {connectedRepos.map((repo) => (
                <Card key={repo.id} hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{repo.fullName}</h3>
                        <StatusBadge 
                          status={repo.isPrivate ? "Private" : "Public"} 
                          variant={repo.isPrivate ? "warning" : "default"}
                        />
                      </div>
                      <p className="text-[#8b8b8b] text-sm font-mono">ID: {repo.githubRepoId}</p>
                    </div>

                    <StatusBadge status={repo.active ? "Active" : "Inactive"} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-[#6b6b6b]">Owner:</span>{" "}
                      <span className="text-[#a1a1a1]">{repo.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6b6b]">Repository:</span>{" "}
                      <span className="text-[#a1a1a1]">{repo.repoName}</span>
                    </div>
                    <div>
                      <span className="text-[#6b6b6b]">Installation ID:</span>{" "}
                      <span className="text-[#a1a1a1] font-mono">{repo.installationId}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}