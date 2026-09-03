"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldQuestion,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DECISION_META } from "@/lib/status";
import { RiskGauge } from "@/components/analysis/risk-gauge";
import { cn } from "@/lib/utils";

const DECISION_ICON = {
  approved: CheckCircle2,
  manual_review: ShieldQuestion,
  rejected: XCircle,
};

export function ResultPanel({ result }: { result: AnalysisResult }) {
  const meta = DECISION_META[result.decision];
  const Icon = DECISION_ICON[result.decision];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-5"
    >
      <Card
        className={cn(
          "flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between",
          meta.tone === "green" &&
            "border-google-green/30 bg-google-green-tint/40",
          meta.tone === "yellow" &&
            "border-google-yellow/30 bg-google-yellow-tint/40",
          meta.tone === "red" && "border-google-red/30 bg-google-red-tint/40",
        )}
      >
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              meta.tone === "green" && "bg-google-green-tint text-google-green",
              meta.tone === "yellow" &&
                "bg-google-yellow-tint text-google-yellow",
              meta.tone === "red" && "bg-google-red-tint text-google-red",
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-medium tracking-tight text-foreground">
              {meta.label}
            </p>
            <p className="mt-1 max-w-md text-sm text-foreground-muted">
              {result.summary}
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {result.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 text-[13px] text-foreground-muted"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground-muted" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RiskGauge score={result.riskScore} />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verification Checklist</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {result.checklist.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                {item.passed ? (
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-google-green" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-google-yellow" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-foreground-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted Fields</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {result.extractedFields.map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">
                    {field.label}
                  </p>
                  <p className="truncate text-xs text-foreground-muted">
                    {field.value}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full bg-google-blue"
                      style={{
                        width: `${Math.round(field.confidence * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-foreground-muted">
                    {Math.round(field.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
