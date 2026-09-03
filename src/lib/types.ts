// Core domain types for the loan analyser / verification workflow app.
// These map closely to what the agentic workflow backend is expected to
// send/receive once the real API is wired up (see src/lib/api.ts).

export type DocumentCategory =
  | "identity"
  | "income"
  | "bank_statement"
  | "property"
  | "tax_return"
  | "credit_report"
  | "other";

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] =
  [
    { value: "identity", label: "Identity Proof" },
    { value: "income", label: "Income Proof" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "property", label: "Property Papers" },
    { value: "tax_return", label: "Tax Return" },
    { value: "credit_report", label: "Credit Report" },
    { value: "other", label: "Other" },
  ];

export type DocumentStatus = "queued" | "uploading" | "uploaded" | "error";

export interface UploadedDocument {
  id: string;
  file: File;
  name: string;
  size: number;
  category: DocumentCategory;
  status: DocumentStatus;
  progress: number;
}

export interface LoanSummary {
  applicantName: string;
  email: string;
  phone: string;
  loanType: string;
  loanAmount: number;
  loanTenureMonths: number;
  purpose: string;
  monthlyIncome: number;
  employmentType: string;
  existingLiabilities: string;
  notes: string;
}

export const EMPTY_LOAN_SUMMARY: LoanSummary = {
  applicantName: "",
  email: "",
  phone: "",
  loanType: "Home Loan",
  loanAmount: 250000,
  loanTenureMonths: 240,
  purpose: "",
  monthlyIncome: 6000,
  employmentType: "Salaried",
  existingLiabilities: "",
  notes: "",
};

export type AgentStatus =
  | "pending"
  | "running"
  | "success"
  | "warning"
  | "error";

export interface AgentNode {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
}

export type WorkflowEventLevel = "info" | "success" | "warning" | "error";

export interface WorkflowEvent {
  id: string;
  runId: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  level: WorkflowEventLevel;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
}

export type AnalysisStatus = "queued" | "running" | "completed" | "failed";

export type Decision = "approved" | "rejected" | "manual_review";

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  verified: boolean;
}

export interface ChecklistItem {
  label: string;
  passed: boolean;
  detail: string;
}

export interface AnalysisResult {
  decision: Decision;
  riskScore: number;
  summary: string;
  reasons: string[];
  extractedFields: ExtractedField[];
  checklist: ChecklistItem[];
}

export interface AnalysisRun {
  id: string;
  createdAt: string;
  status: AnalysisStatus;
  loanSummary: LoanSummary;
  documents: {
    id: string;
    name: string;
    size: number;
    category: DocumentCategory;
  }[];
  agents: AgentNode[];
  result?: AnalysisResult;
}
