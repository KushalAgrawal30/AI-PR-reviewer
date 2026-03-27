"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { LoadingState } from "@/app/components/ui/LoadingState";

type LoggedInUser = {
  id: number;
  githubLogin: string;
  name: string;
  avatarUrl: string;
};

function RepositorySetupContent() {
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
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-white mb-6">GitHub App Setup</h1>

          {error ? (
            <>
              <p className="text-red-500 mb-6">{error}</p>
              <Button
                onClick={() => router.replace("/repositories")}
                variant="primary"
              >
                Back to Repositories
              </Button>
            </>
          ) : (
            <LoadingState message={status} />
          )}
        </Card>
      </div>
    </main>
  );
}

export default function RepositorySetupPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading..." />
      </main>
    }>
      <RepositorySetupContent />
    </Suspense>
  );
}