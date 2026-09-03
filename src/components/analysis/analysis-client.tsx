"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileSearch } from "lucide-react";
import { useRunsStore } from "@/store/useRunsStore";
import { AgentPipeline } from "@/components/analysis/agent-pipeline";
import { EventConsole } from "@/components/analysis/event-console";
import { ResultPanel } from "@/components/analysis/result-panel";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/progress";
import { RUN_STATUS_META } from "@/lib/status";
import { formatCurrency } from "@/lib/utils";

const EMPTY_EVENTS: never[] = [];

export function AnalysisClient({ runId }: { runId: string }) {
  const run = useRunsStore((s) => s.runs[runId]);
  const eventsMap = useRunsStore((s) => s.events);
  const events = eventsMap[runId] ?? EMPTY_EVENTS;

  if (!run) {
    return (
      <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <FileSearch className="h-8 w-8 text-foreground-muted" />
        <h1 className="text-lg font-medium text-foreground">
          Analysis not found
        </h1>
        <p className="text-sm text-foreground-muted">
          This run doesn&apos;t exist yet, or the id is invalid.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-google-blue-hover hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const statusMeta = RUN_STATUS_META[run.status];

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              {run.loanSummary.applicantName || "Unnamed applicant"}
            </h1>
            {run.status === "running" ? (
              <Badge tone="blue">
                <Spinner className="h-3 w-3" /> {statusMeta.label}
              </Badge>
            ) : (
              <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground-muted">
            <span>{run.loanSummary.loanType}</span>
            <span>{formatCurrency(run.loanSummary.loanAmount)}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(run.createdAt).toLocaleString()}
            </span>
            <span className="font-mono text-xs text-foreground-muted/70">
              {run.id}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AgentPipeline agents={run.agents} />
        </div>

        <div className="flex flex-col gap-6">
          <EventConsole events={events} live={run.status === "running"} />
          {run.result && <ResultPanel result={run.result} />}
        </div>
      </div>
    </div>
  );
}
