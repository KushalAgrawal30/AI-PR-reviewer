"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { LoadingState } from "@/app/components/ui/LoadingState";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { fetchCurrentUser } from "@/lib/auth";


type ReviewJob = {
    id: number;
    repositoryName: string;
    prNumber: number;
    title: string;
    summary: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
};

export default function ReviewJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<ReviewJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const user = await fetchCurrentUser();

                if (!user) {
                    setError("Unable to load user data");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review-jobs`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch review jobs");
                }

                const data = await response.json();
                setJobs(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
                <LoadingState message="Loading review jobs..." />
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
                    title="Review Jobs"
                    description="AI-powered pull request review results"
                    actions={
                        <Button onClick={() => router.push("/dashboard")} variant="secondary">
                            Back to Dashboard
                        </Button>
                    }
                />

                {jobs.length === 0 ? (
                    <Card>
                        <EmptyState
                            title="No review jobs found"
                            description="Review jobs will appear here once you've connected repositories and opened pull requests."
                            action={
                                <Button onClick={() => router.push("/repositories")} variant="primary">
                                    Connect Repositories
                                </Button>
                            }
                        />
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <Link
                                key={job.id}
                                href={`/review-jobs/${job.id}`}
                                className="block group"
                            >
                                <Card hover>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors break-words">
                                                {job.title}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#8b8b8b]">
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                    </svg>
                                                    <span className="truncate">{job.repositoryName}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5 flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                    </svg>
                                                    PR #{job.prNumber}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <StatusBadge status={job.status} />
                                        </div>
                                    </div>

                                    {job.summary && (
                                        <p className="text-[#a1a1a1] text-sm mb-3 line-clamp-2">
                                            {job.summary}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#6b6b6b]">
                                        <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>Updated {new Date(job.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}