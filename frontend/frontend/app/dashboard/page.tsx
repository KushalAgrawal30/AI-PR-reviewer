"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.githubLogin}
                className="h-16 w-16 rounded-full border object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full border" />
            )}

            <div>
              <h1 className="text-3xl font-bold">
                {user.name || user.githubLogin}
              </h1>
              <p className="text-gray-600">@{user.githubLogin}</p>
              <p className="text-sm text-gray-500">User ID: {user.id}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/review-jobs"
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="mb-2 text-xl font-semibold">Review Jobs</h2>
            <p className="text-gray-600">
              View all AI pull request review jobs and findings.
            </p>
          </Link>

          <Link
            href="/repositories"
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="mb-2 text-xl font-semibold">Repositories</h2>
            <p className="text-gray-600">
              Select and manage repositories connected to your account.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}