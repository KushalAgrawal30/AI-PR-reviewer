"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ReviewFinding = {
  id: number;
  filePath: string;
  lineNumber: number;
  severity: string;
  category: string;
  title: string;
  description: string;
  suggestion: string;
  confidence: number;
};

type ReviewJobDetails = {
  id: number;
  repositoryName: string;
  prNumber: number;
  title: string;
  description: string;
  summary: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  findings: ReviewFinding[];
};

export default function ReviewJobDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<ReviewJobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review-jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch review job details");
        }

        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading review job details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!job) {
    return <div className="p-6">Review job not found.</div>;
  }

  return (
    <main className="min-h-screen p-6">
      <Link
        href="/review-job"
        className="inline-block mb-6 text-sm underline"
      >
        ← Back to Review Jobs
      </Link>

      <div className="border rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <span className="text-sm font-medium px-3 py-1 rounded-full border">
            {job.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-1">
          Repository: {job.repositoryName}
        </p>
        <p className="text-sm text-gray-600 mb-1">PR Number: {job.prNumber}</p>
        <p className="text-sm text-gray-600 mb-3">
          Created At: {new Date(job.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Updated At: {new Date(job.updatedAt).toLocaleString()}
        </p>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Description</h2>
          <p className="text-gray-700">
            {job.description || "No description provided"}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Summary</h2>
          <p className="text-gray-700">{job.summary || "No summary available"}</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Findings ({job.findings.length})
        </h2>

        {job.findings.length === 0 ? (
          <p>No findings found for this review job.</p>
        ) : (
          <div className="space-y-4">
            {job.findings.map((finding) => (
              <div
                key={finding.id}
                className="border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{finding.title}</h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full border">
                    {finding.severity}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  File: {finding.filePath}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Line: {finding.lineNumber}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Category: {finding.category}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Confidence: {finding.confidence}
                </p>

                <div className="mb-3">
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-gray-700">{finding.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Suggestion</h4>
                  <p className="text-gray-700">{finding.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}