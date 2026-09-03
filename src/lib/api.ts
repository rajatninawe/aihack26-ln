// -----------------------------------------------------------------------
// Central place for all calls to the agentic workflow backend.
//
// The UI is fully wired against this file — every network interaction the
// app needs (submitting an application, polling/streaming run status, and
// reading back events) flows through the functions below. Right now they
// are backed by an in-memory mock simulation so the product can be
// demoed end-to-end without a live backend. Replace the internals with
// real `fetch`/SSE calls once the workflow platform's API is available —
// the function signatures are designed to stay stable.
// -----------------------------------------------------------------------

import type { AnalysisRun, DocumentCategory, LoanSummary } from "@/lib/types";
import { simulateWorkflowRun } from "@/lib/mock-data";
import { useRunsStore } from "@/store/useRunsStore";

// TODO: point this at the real workflow platform, e.g. via env var.
export const API_BASE_URL = process.env.NEXT_PUBLIC_WORKFLOW_API_BASE_URL ?? "";

export interface SubmitAnalysisPayload {
  loanSummary: LoanSummary;
  documents: {
    id: string;
    name: string;
    size: number;
    category: DocumentCategory;
  }[];
}

const activeSimulations = new Map<string, () => void>();

/**
 * Kicks off a new workflow run for the given loan application.
 *
 * TODO(real API): replace with something like
 * ```ts
 * const res = await fetch(`${API_BASE_URL}/v1/workflows/loan-analysis/runs`, {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify(payload),
 * });
 * const { runId } = await res.json();
 * ```
 */
export async function submitLoanForAnalysis(
  payload: SubmitAnalysisPayload,
): Promise<{ runId: string }> {
  const { createRun, appendEvent, updateAgentStatus, completeRun } =
    useRunsStore.getState();
  const runId = createRun(payload.loanSummary, payload.documents);

  const stop = simulateWorkflowRun(
    runId,
    payload.loanSummary,
    payload.documents,
    {
      onEvent: (event) => appendEvent(runId, event),
      onAgentStatus: (agentId, status) =>
        updateAgentStatus(runId, agentId, status),
      onComplete: (result) => {
        completeRun(runId, result);
        activeSimulations.delete(runId);
      },
    },
  );
  activeSimulations.set(runId, stop);

  return { runId };
}

/**
 * Fetches the current snapshot of a run (status, agents, result if any).
 * TODO(real API): `GET ${API_BASE_URL}/v1/workflows/loan-analysis/runs/${runId}`
 */
export async function getAnalysisRun(
  runId: string,
): Promise<AnalysisRun | undefined> {
  return useRunsStore.getState().runs[runId];
}

/**
 * Lists recently submitted runs for the dashboard.
 * TODO(real API): `GET ${API_BASE_URL}/v1/workflows/loan-analysis/runs`
 */
export async function listAnalysisRuns(): Promise<AnalysisRun[]> {
  const { runs, order } = useRunsStore.getState();
  return order.map((id) => runs[id]).filter(Boolean);
}

// Live event delivery is exposed reactively via the zustand store itself —
// components subscribe with `useRunsStore((s) => s.events[runId])` and
// re-render as new events arrive. When a real backend exists, the
// simplest swap is to replace `simulateWorkflowRun` above with an
// EventSource/WebSocket that calls the same `appendEvent` /
// `updateAgentStatus` / `completeRun` store actions as messages arrive, e.g.
// ```ts
// const es = new EventSource(`${API_BASE_URL}/v1/workflows/loan-analysis/runs/${runId}/events`);
// es.onmessage = (e) => appendEvent(runId, JSON.parse(e.data));
// ```
