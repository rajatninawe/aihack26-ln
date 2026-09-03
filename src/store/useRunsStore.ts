import { create } from "zustand";
import type {
  AgentStatus,
  AnalysisResult,
  AnalysisRun,
  DocumentCategory,
  LoanSummary,
  WorkflowEvent,
} from "@/lib/types";
import { createInitialAgents, MOCK_RECENT_RUNS } from "@/lib/mock-data";
import { uid } from "@/lib/utils";

interface RunsState {
  runs: Record<string, AnalysisRun>;
  events: Record<string, WorkflowEvent[]>;
  order: string[];
  createRun: (
    loanSummary: LoanSummary,
    documents: {
      id: string;
      name: string;
      size: number;
      category: DocumentCategory;
    }[],
  ) => string;
  appendEvent: (runId: string, event: WorkflowEvent) => void;
  updateAgentStatus: (
    runId: string,
    agentId: string,
    status: AgentStatus,
  ) => void;
  completeRun: (runId: string, result: AnalysisResult) => void;
}

const seedRuns: Record<string, AnalysisRun> = {};
MOCK_RECENT_RUNS.forEach((run) => {
  seedRuns[run.id] = run;
});

export const useRunsStore = create<RunsState>((set) => ({
  runs: seedRuns,
  events: {},
  order: MOCK_RECENT_RUNS.map((run) => run.id),

  createRun: (loanSummary, documents) => {
    const id = uid("run");
    const run: AnalysisRun = {
      id,
      createdAt: new Date().toISOString(),
      status: "running",
      loanSummary,
      documents,
      agents: createInitialAgents(),
    };
    set((s) => ({
      runs: { ...s.runs, [id]: run },
      events: { ...s.events, [id]: [] },
      order: [id, ...s.order],
    }));
    return id;
  },

  appendEvent: (runId, event) => {
    set((s) => ({
      events: { ...s.events, [runId]: [...(s.events[runId] ?? []), event] },
    }));
  },

  updateAgentStatus: (runId, agentId, status) => {
    set((s) => {
      const run = s.runs[runId];
      if (!run) return s;
      return {
        runs: {
          ...s.runs,
          [runId]: {
            ...run,
            agents: run.agents.map((a) =>
              a.id === agentId ? { ...a, status } : a,
            ),
          },
        },
      };
    });
  },

  completeRun: (runId, result) => {
    set((s) => {
      const run = s.runs[runId];
      if (!run) return s;
      return {
        runs: {
          ...s.runs,
          [runId]: { ...run, status: "completed", result },
        },
      };
    });
  },
}));
