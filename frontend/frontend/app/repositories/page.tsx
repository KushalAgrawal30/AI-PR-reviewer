"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-600">Loading repositories...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-red-600">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Repositories</h1>
            <p className="text-gray-600">
              {user ? `Repositories for @${user.githubLogin}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleInstallApp}
              disabled={installing}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
            >
              {installing ? "Redirecting..." : "Connect Repository"}
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">All GitHub Repositories</h2>

          {allRepos.length === 0 ? (
            <div className="rounded-2xl border p-6 shadow-sm">
              <p className="text-gray-600">No GitHub repositories found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allRepos.map((repo) => (
                <div
                  key={repo.githubRepoId}
                  className="rounded-2xl border p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{repo.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        {repo.isPrivate ? "Private" : "Public"}
                      </p>
                    </div>

                    <span className="rounded-full border px-3 py-1 text-sm font-medium">
                      {repo.connected ? "Connected" : "Not Connected"}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Repository ID: {repo.githubRepoId}</p>
                    <p>Owner: {repo.ownerName}</p>
                    <p>Name: {repo.name}</p>
                    <p>
                      Installation ID:{" "}
                      {repo.installationId !== null ? repo.installationId : "Not available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Connected Repositories</h2>

          {connectedRepos.length === 0 ? (
            <div className="rounded-2xl border p-6 shadow-sm">
              <p className="text-gray-600">No connected repositories yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {connectedRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="rounded-2xl border p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{repo.fullName}</h3>
                    <span className="rounded-full border px-3 py-1 text-sm font-medium">
                      {repo.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Repository ID: {repo.githubRepoId}</p>
                    <p>Owner: {repo.ownerName}</p>
                    <p>Name: {repo.repoName}</p>
                    <p>Installation ID: {repo.installationId}</p>
                    <p>Private: {repo.isPrivate ? "Yes" : "No"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}