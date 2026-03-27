"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { LoadingState } from "@/app/components/ui/LoadingState";
import { EmptyState } from "@/app/components/ui/EmptyState";

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
  const router = useRouter();
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
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <LoadingState message="Loading review job details..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => router.push("/review-job")}>
            Back to Review Jobs
          </Button>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-[#8b8b8b] mb-4">Review job not found.</p>
          <Button onClick={() => router.push("/review-job")}>
            Back to Review Jobs
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/review-job"
            className="inline-flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Review Jobs
          </Link>
        </div>

        <PageHeader
          title={job.title}
          actions={<StatusBadge status={job.status} />}
        />

        <Card className="mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <svg className="w-4 h-4 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-[#6b6b6b]">Repository:</span>
                <span className="text-[#a1a1a1] font-medium">{job.repositoryName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-[#6b6b6b]">Pull Request:</span>
                <span className="text-[#a1a1a1] font-medium">#{job.prNumber}</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="mb-2">
                <span className="text-[#6b6b6b]">Created:</span>{" "}
                <span className="text-[#a1a1a1]">{new Date(job.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#6b6b6b]">Updated:</span>{" "}
                <span className="text-[#a1a1a1]">{new Date(job.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {job.description && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
              <p className="text-[#a1a1a1] text-sm leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {job.summary && (
            <div className="pt-4 border-t border-[#252525]">
              <h3 className="text-sm font-semibold text-white mb-2">Summary</h3>
              <p className="text-[#a1a1a1] text-sm leading-relaxed">{job.summary}</p>
            </div>
          )}
        </Card>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Findings
              <span className="ml-2 text-[#6b6b6b] text-base font-normal">
                ({job.findings.length})
              </span>
            </h2>
          </div>

          {job.findings.length === 0 ? (
            <Card>
              <EmptyState
                title="No findings"
                description="This review job completed without any findings to report."
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {job.findings.map((finding) => (
                <Card key={finding.id} className="hover:border-[#2a2a2a] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white mb-2">{finding.title}</h3>
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span className="text-[#8b8b8b]">
                          <span className="text-[#6b6b6b]">File:</span>{" "}
                          <span className="font-mono">{finding.filePath}</span>
                        </span>
                        <span className="text-[#8b8b8b]">
                          <span className="text-[#6b6b6b]">Line:</span>{" "}
                          <span className="font-mono">{finding.lineNumber}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={finding.severity} />
                      <StatusBadge status={finding.category} variant="default" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-[#8b8b8b] uppercase tracking-wider mb-1.5">
                        Description
                      </h4>
                      <p className="text-[#a1a1a1] text-sm leading-relaxed">{finding.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1a1a1a]">
                      <h4 className="text-xs font-semibold text-[#8b8b8b] uppercase tracking-wider mb-1.5">
                        Suggestion
                      </h4>
                      <p className="text-[#a1a1a1] text-sm leading-relaxed">{finding.suggestion}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
                      <span>Confidence:</span>
                      <span className="font-mono text-[#8b8b8b]">{finding.confidence}%</span>
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