"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    const [jobs, setJobs] = useState<ReviewJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review-jobs`
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
        return <div className="p-6">Loading review jobs...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <main className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Review Jobs</h1>

            {jobs.length === 0 ? (
                <p>No review jobs found.</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/review-jobs/${job.id}`}
                            className="block border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-semibold">{job.title}</h2>
                                <span className="text-sm font-medium px-3 py-1 rounded-full border">
                                    {job.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">
                                Repository: {job.repositoryName}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">PR Number: {job.prNumber}</p>
                            <p className="text-sm text-gray-700 mb-2">
                                {job.summary || "No summary available"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Created At: {new Date(job.createdAt).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}