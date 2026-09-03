"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Inbox } from "lucide-react";
import type { AnalysisRun } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/progress";
import { DECISION_META, RUN_STATUS_META } from "@/lib/status";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export function RecentRuns({ runs }: { runs: AnalysisRun[] }) {
  return (
    <section
      id="recent"
      className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium tracking-tight text-foreground">
          Recent Analyses
        </h2>
        <span className="text-[13px] text-foreground-muted">
          {runs.length} total
        </span>
      </div>

      {runs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Inbox className="h-6 w-6 text-foreground-muted" />
          <p className="text-sm text-foreground-muted">
            No analyses yet. Start your first one above.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {runs.map((run, i) => {
              const statusMeta = RUN_STATUS_META[run.status];
              const decisionMeta = run.result
                ? DECISION_META[run.result.decision]
                : null;

              return (
                <motion.div
                  key={run.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(i * 0.04, 0.3),
                  }}
                >
                  <Link href={`/analysis/${run.id}`}>
                    <Card className="group flex items-center justify-between gap-4 p-4 hover:border-google-blue/40 hover:shadow-elevated sm:p-5">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-hover text-sm font-medium text-foreground-muted sm:flex">
                          {(run.loanSummary.applicantName || "?")
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">
                              {run.loanSummary.applicantName ||
                                "Unnamed applicant"}
                            </p>
                            <span className="hidden text-foreground-muted sm:inline">
                              ·
                            </span>
                            <p className="hidden truncate text-[13px] text-foreground-muted sm:inline">
                              {run.loanSummary.loanType}
                            </p>
                          </div>
                          <p className="mt-0.5 truncate text-[13px] text-foreground-muted">
                            {formatCurrency(run.loanSummary.loanAmount)} ·{" "}
                            <span suppressHydrationWarning>
                              {formatRelativeTime(run.createdAt)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {run.status === "running" ? (
                          <Badge tone="blue">
                            <Spinner className="h-3 w-3 text-google-blue" />{" "}
                            {statusMeta.label}
                          </Badge>
                        ) : decisionMeta ? (
                          <Badge tone={decisionMeta.tone} dot>
                            {decisionMeta.label}
                          </Badge>
                        ) : (
                          <Badge tone={statusMeta.tone}>
                            {statusMeta.label}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-foreground-muted transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
