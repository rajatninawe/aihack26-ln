"use client";

import { motion } from "framer-motion";
import { Check, Loader2, TriangleAlert, X } from "lucide-react";
import type { AgentNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AgentNode["status"], string> = {
  pending: "border-border text-foreground-muted bg-surface",
  running:
    "border-google-blue text-google-blue-hover bg-google-blue-tint animate-pulse-ring",
  success: "border-google-green text-google-green bg-google-green-tint",
  warning: "border-google-yellow text-google-yellow bg-google-yellow-tint",
  error: "border-google-red text-google-red bg-google-red-tint",
};

function StatusIcon({ status }: { status: AgentNode["status"] }) {
  if (status === "running") return <Loader2 className="h-4 w-4 animate-spin" />;
  if (status === "success") return <Check className="h-4 w-4" />;
  if (status === "warning") return <TriangleAlert className="h-4 w-4" />;
  if (status === "error") return <X className="h-4 w-4" />;
  return <span className="h-1.5 w-1.5 rounded-full bg-current" />;
}

export function AgentPipeline({ agents }: { agents: AgentNode[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {agents.map((agent, i) => (
            <motion.li
              key={agent.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex gap-3.5 pb-6 last:pb-0"
            >
              {i < agents.length - 1 && (
                <span
                  className={cn(
                    "absolute top-8 left-[15px] h-full w-0.5 -translate-x-1/2 bg-border transition-colors",
                    agent.status === "success" && "bg-google-green/60",
                  )}
                />
              )}
              <span
                className={cn(
                  "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  STATUS_STYLES[agent.status],
                )}
              >
                <StatusIcon status={agent.status} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    agent.status === "pending"
                      ? "text-foreground-muted"
                      : "text-foreground",
                  )}
                >
                  {agent.name}
                </p>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {agent.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
