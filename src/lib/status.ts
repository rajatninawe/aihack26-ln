import type {
  AgentStatus,
  AnalysisStatus,
  Decision,
  WorkflowEventLevel,
} from "@/lib/types";

type Tone = "neutral" | "blue" | "green" | "yellow" | "red";

export const DECISION_META: Record<Decision, { label: string; tone: Tone }> = {
  approved: { label: "Approved", tone: "green" },
  manual_review: { label: "Needs Review", tone: "yellow" },
  rejected: { label: "Rejected", tone: "red" },
};

export const RUN_STATUS_META: Record<
  AnalysisStatus,
  { label: string; tone: Tone }
> = {
  queued: { label: "Queued", tone: "neutral" },
  running: { label: "In Progress", tone: "blue" },
  completed: { label: "Completed", tone: "green" },
  failed: { label: "Failed", tone: "red" },
};

export const AGENT_STATUS_META: Record<
  AgentStatus,
  { label: string; tone: Tone }
> = {
  pending: { label: "Pending", tone: "neutral" },
  running: { label: "Running", tone: "blue" },
  success: { label: "Passed", tone: "green" },
  warning: { label: "Flagged", tone: "yellow" },
  error: { label: "Failed", tone: "red" },
};

export const EVENT_LEVEL_META: Record<
  WorkflowEventLevel,
  { label: string; tone: Tone }
> = {
  info: { label: "Info", tone: "blue" },
  success: { label: "Success", tone: "green" },
  warning: { label: "Warning", tone: "yellow" },
  error: { label: "Error", tone: "red" },
};
