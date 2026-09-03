"use client";

import { motion } from "framer-motion";
import {
  FileStack,
  ShieldCheck,
  TimerReset,
  TriangleAlert,
} from "lucide-react";
import type { AnalysisRun } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function StatCards({ runs }: { runs: AnalysisRun[] }) {
  const total = runs.length;
  const approved = runs.filter((r) => r.result?.decision === "approved").length;
  const flagged = runs.filter(
    (r) => r.result?.decision === "manual_review",
  ).length;
  const inProgress = runs.filter((r) => r.status === "running").length;

  const stats = [
    {
      label: "Total Analyses",
      value: total,
      icon: FileStack,
      tone: "text-google-blue",
      bg: "bg-google-blue-tint",
    },
    {
      label: "Auto-Approved",
      value: approved,
      icon: ShieldCheck,
      tone: "text-google-green",
      bg: "bg-google-green-tint",
    },
    {
      label: "Needs Review",
      value: flagged,
      icon: TriangleAlert,
      tone: "text-google-yellow",
      bg: "bg-google-yellow-tint",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: TimerReset,
      tone: "text-google-blue",
      bg: "bg-google-blue-tint",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * i }}
        >
          <Card className="p-5 hover:shadow-elevated">
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${stat.bg}`}
            >
              <stat.icon className={`h-4.5 w-4.5 ${stat.tone}`} />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </div>
            <div className="mt-0.5 text-[13px] text-foreground-muted">
              {stat.label}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
