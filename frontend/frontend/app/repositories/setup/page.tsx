"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LoggedInUser = {
  id: number;
  githubLogin: string;
  name: string;
  avatarUrl: string;
};

export default function RepositorySetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("Completing GitHub App setup...");
  const [error, setError] = useState("");

  useEffect(() => {
    const connectInstalledRepos = async () => {
      const installationId = searchParams.get("installation_id");
      const storedUser = localStorage.getItem("loggedInUser");

      if (!storedUser) {
        router.replace("/login");
        return;
      }

      if (!installationId) {
        setError("Missing installation id from GitHub setup.");
        return;
      }

      try {
        const user: LoggedInUser = JSON.parse(storedUser);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/connect`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              installationId: Number(installationId),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to connect installed repositories");
        }

        setStatus("Repositories connected successfully. Redirecting...");

        setTimeout(() => {
          router.replace("/repositories");
        }, 1200);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong during setup"
        );
      }
    };

    connectInstalledRepos();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-3">GitHub App Setup</h1>

        {error ? (
          <>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.replace("/repositories")}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Back to Repositories
            </button>
          </>
        ) : (
          <p className="text-gray-600">{status}</p>
        )}
      </div>
    </main>
  );
}