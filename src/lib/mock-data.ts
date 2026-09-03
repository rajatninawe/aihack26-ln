import type {
  AgentNode,
  AgentStatus,
  AnalysisResult,
  AnalysisRun,
  ChecklistItem,
  Decision,
  DocumentCategory,
  ExtractedField,
  LoanSummary,
  WorkflowEvent,
} from "@/lib/types";
import { uid } from "@/lib/utils";

// The agent pipeline definition. In production this would be fetched from
// the workflow platform (e.g. GET /workflows/:workflowId) so the UI always
// reflects the real graph of agents configured server-side.
export const AGENT_PIPELINE: Omit<AgentNode, "status">[] = [
  {
    id: "intake",
    name: "Document Intake Agent",
    description: "Parses uploaded documents and extracts raw text/fields.",
  },
  {
    id: "identity",
    name: "Identity Verification Agent",
    description: "Cross-checks applicant identity against submitted ID proofs.",
  },
  {
    id: "income",
    name: "Income & Employment Agent",
    description: "Validates income statements and employment continuity.",
  },
  {
    id: "credit",
    name: "Credit Risk Scoring Agent",
    description: "Computes risk score from liabilities, income and history.",
  },
  {
    id: "fraud",
    name: "Fraud & Anomaly Agent",
    description: "Scans for tampering, duplicate submissions and anomalies.",
  },
  {
    id: "decision",
    name: "Policy & Decision Agent",
    description: "Applies lending policy rules to reach a final decision.",
  },
];

export function createInitialAgents(): AgentNode[] {
  return AGENT_PIPELINE.map((agent, i) => ({
    ...agent,
    status: (i === 0 ? "running" : "pending") as AgentStatus,
  }));
}

const AGENT_LOG_LINES: Record<string, string[]> = {
  intake: [
    "Reading uploaded file bytes and detecting MIME types",
    "Running OCR pipeline across scanned pages",
    "Normalizing extracted key-value fields",
  ],
  identity: [
    "Matching applicant name against ID proof record",
    "Validating document expiry and issuing authority",
    "Checking against watchlist and sanctions databases",
  ],
  income: [
    "Parsing payslips and computing average monthly income",
    "Verifying employer details against public registry",
    "Cross-referencing declared income with bank statement inflows",
  ],
  credit: [
    "Calculating debt-to-income ratio",
    "Fetching bureau score signal",
    "Simulating repayment schedule under current rates",
  ],
  fraud: [
    "Running document tamper detection model",
    "Checking for duplicate submissions across applicants",
    "Scoring behavioral anomaly signals",
  ],
  decision: [
    "Aggregating agent outputs into policy engine",
    "Evaluating lending policy rule set",
    "Drafting final decision rationale",
  ],
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function makeEvent(
  runId: string,
  agentId: string,
  agentName: string,
  level: WorkflowEvent["level"],
  title: string,
  message: string,
  payload?: Record<string, unknown>,
): WorkflowEvent {
  return {
    id: uid("evt"),
    runId,
    timestamp: new Date().toISOString(),
    agentId,
    agentName,
    level,
    title,
    message,
    payload,
  };
}

interface SimulationHandlers {
  onEvent: (event: WorkflowEvent) => void;
  onAgentStatus: (agentId: string, status: AgentStatus) => void;
  onComplete: (result: AnalysisResult) => void;
}

/**
 * Simulates a running agentic workflow by emitting events over time.
 * Swap this out for a real subscription (SSE/WebSocket) once the workflow
 * platform's event API is available — see subscribeToWorkflowEvents in
 * src/lib/api.ts for the single place this would need to change.
 */
export function simulateWorkflowRun(
  runId: string,
  loanSummary: LoanSummary,
  documents: { name: string; category: DocumentCategory }[],
  handlers: SimulationHandlers,
): () => void {
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;
  let elapsed = 0;

  const schedule = (fn: () => void, delay: number) => {
    elapsed += delay;
    const t = setTimeout(() => {
      if (!cancelled) fn();
    }, elapsed);
    timeouts.push(t);
  };

  schedule(() => {
    handlers.onEvent(
      makeEvent(
        runId,
        "system",
        "Workflow Orchestrator",
        "info",
        "Workflow started",
        `Run ${runId} accepted and queued for processing.`,
      ),
    );
  }, 200);

  AGENT_PIPELINE.forEach((agent, index) => {
    schedule(() => {
      handlers.onAgentStatus(agent.id, "running");
      handlers.onEvent(
        makeEvent(
          runId,
          agent.id,
          agent.name,
          "info",
          `${agent.name} started`,
          agent.description,
        ),
      );
    }, 500);

    const lines = AGENT_LOG_LINES[agent.id] ?? [];
    lines.forEach((line) => {
      schedule(
        () => {
          handlers.onEvent(
            makeEvent(runId, agent.id, agent.name, "info", "Processing", line, {
              step: line,
            }),
          );
        },
        randomBetween(500, 950),
      );
    });

    schedule(
      () => {
        const warn = agent.id === "fraud" && Math.random() < 0.35;
        handlers.onAgentStatus(agent.id, warn ? "warning" : "success");
        handlers.onEvent(
          makeEvent(
            runId,
            agent.id,
            agent.name,
            warn ? "warning" : "success",
            warn
              ? `${agent.name} flagged a minor anomaly`
              : `${agent.name} completed`,
            warn
              ? "Anomaly score above soft threshold — routed for additional review."
              : `Completed with no blocking issues (${index + 1}/${AGENT_PIPELINE.length}).`,
          ),
        );
      },
      randomBetween(400, 700),
    );
  });

  schedule(() => {
    const result = buildResult(loanSummary, documents);
    handlers.onEvent(
      makeEvent(
        runId,
        "system",
        "Workflow Orchestrator",
        result.decision === "rejected"
          ? "error"
          : result.decision === "manual_review"
            ? "warning"
            : "success",
        "Workflow completed",
        `Final decision: ${result.decision.replace("_", " ")}.`,
      ),
    );
    handlers.onComplete(result);
  }, 400);

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}

function buildResult(
  loanSummary: LoanSummary,
  documents: { name: string; category: DocumentCategory }[],
): AnalysisResult {
  const annualIncome = loanSummary.monthlyIncome * 12;
  const dti = annualIncome > 0 ? loanSummary.loanAmount / annualIncome : 999;

  let riskScore = Math.max(
    5,
    Math.min(95, Math.round(dti * 18 + randomBetween(-6, 6))),
  );
  const hasFraudFlag = Math.random() < 0.3;
  if (hasFraudFlag) riskScore = Math.min(95, riskScore + randomBetween(10, 20));

  let decision: Decision = "approved";
  if (riskScore > 70) decision = "rejected";
  else if (riskScore > 45) decision = "manual_review";

  const reasons: string[] = [];
  if (dti > 4)
    reasons.push(
      "Requested loan amount is high relative to declared annual income.",
    );
  if (hasFraudFlag)
    reasons.push(
      "Fraud agent flagged a minor document anomaly requiring manual look.",
    );
  if (documents.length < 2)
    reasons.push("Limited supporting documentation was provided.");
  if (reasons.length === 0)
    reasons.push("All verification checks passed within policy thresholds.");

  const extractedFields: ExtractedField[] = [
    {
      label: "Applicant Name",
      value: loanSummary.applicantName || "—",
      confidence: 0.98,
      verified: true,
    },
    {
      label: "Declared Monthly Income",
      value: `$${loanSummary.monthlyIncome.toLocaleString()}`,
      confidence: 0.94,
      verified: true,
    },
    {
      label: "Employment Type",
      value: loanSummary.employmentType,
      confidence: 0.9,
      verified: true,
    },
    {
      label: "Bank Statement Avg. Inflow",
      value: `$${Math.round(loanSummary.monthlyIncome * (0.9 + Math.random() * 0.2)).toLocaleString()}`,
      confidence: 0.87,
      verified: documents.some((d) => d.category === "bank_statement"),
    },
    {
      label: "ID Document Match",
      value: documents.some((d) => d.category === "identity")
        ? "Match"
        : "Not provided",
      confidence: 0.92,
      verified: documents.some((d) => d.category === "identity"),
    },
  ];

  const checklist: ChecklistItem[] = [
    {
      label: "Identity verified against government ID",
      passed: documents.some((d) => d.category === "identity"),
      detail: "ID proof cross-checked with facial + text match.",
    },
    {
      label: "Income consistent with bank inflow",
      passed: dti < 6,
      detail: "Declared income compared against 6-month statement average.",
    },
    {
      label: "No duplicate or tampered documents",
      passed: !hasFraudFlag,
      detail: "Forensic scan across all uploaded files.",
    },
    {
      label: "Debt-to-income within policy",
      passed: dti <= 5,
      detail: `Computed DTI ratio: ${dti.toFixed(2)}x`,
    },
  ];

  const summary =
    decision === "approved"
      ? "The applicant meets all verification and risk thresholds for automatic approval."
      : decision === "manual_review"
        ? "The applicant passes most checks, but one or more signals require human review before a decision."
        : "The applicant's risk profile exceeds policy thresholds for automatic approval.";

  return { decision, riskScore, summary, reasons, extractedFields, checklist };
}

// ---- Dashboard mock data (recent runs) --------------------------------

export const MOCK_RECENT_RUNS: AnalysisRun[] = [
  {
    id: "run_8f3a1c",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "completed",
    loanSummary: {
      ...emptySummary(),
      applicantName: "Maria Gonzalez",
      loanAmount: 320000,
      loanType: "Home Loan",
    },
    documents: [],
    agents: createInitialAgents().map((a) => ({ ...a, status: "success" })),
    result: {
      decision: "approved",
      riskScore: 22,
      summary: "Approved automatically.",
      reasons: [],
      extractedFields: [],
      checklist: [],
    },
  },
  {
    id: "run_2d9b7e",
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    status: "completed",
    loanSummary: {
      ...emptySummary(),
      applicantName: "Daniel Kim",
      loanAmount: 45000,
      loanType: "Personal Loan",
    },
    documents: [],
    agents: createInitialAgents().map((a) => ({ ...a, status: "success" })),
    result: {
      decision: "manual_review",
      riskScore: 58,
      summary: "Needs human review.",
      reasons: [],
      extractedFields: [],
      checklist: [],
    },
  },
  {
    id: "run_51ac0f",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: "completed",
    loanSummary: {
      ...emptySummary(),
      applicantName: "Priya Nair",
      loanAmount: 610000,
      loanType: "Business Loan",
    },
    documents: [],
    agents: createInitialAgents().map((a) => ({ ...a, status: "success" })),
    result: {
      decision: "rejected",
      riskScore: 81,
      summary: "Rejected — high risk.",
      reasons: [],
      extractedFields: [],
      checklist: [],
    },
  },
  {
    id: "run_a417cd",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    status: "completed",
    loanSummary: {
      ...emptySummary(),
      applicantName: "James Whitfield",
      loanAmount: 180000,
      loanType: "Auto Loan",
    },
    documents: [],
    agents: createInitialAgents().map((a) => ({ ...a, status: "success" })),
    result: {
      decision: "approved",
      riskScore: 31,
      summary: "Approved automatically.",
      reasons: [],
      extractedFields: [],
      checklist: [],
    },
  },
];

function emptySummary(): LoanSummary {
  return {
    applicantName: "",
    email: "",
    phone: "",
    loanType: "Home Loan",
    loanAmount: 0,
    loanTenureMonths: 240,
    purpose: "",
    monthlyIncome: 0,
    employmentType: "Salaried",
    existingLiabilities: "",
    notes: "",
  };
}
