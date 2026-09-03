import { create } from "zustand";
import { EMPTY_LOAN_SUMMARY } from "@/lib/types";
import type {
  DocumentCategory,
  DocumentStatus,
  LoanSummary,
  UploadedDocument,
} from "@/lib/types";
import { uid } from "@/lib/utils";

interface WizardState {
  step: number;
  loanSummary: LoanSummary;
  documents: UploadedDocument[];
  setStep: (step: number) => void;
  updateLoanSummary: (patch: Partial<LoanSummary>) => void;
  addFiles: (files: File[]) => string[];
  updateDocumentCategory: (id: string, category: DocumentCategory) => void;
  updateDocumentProgress: (
    id: string,
    progress: number,
    status?: DocumentStatus,
  ) => void;
  removeDocument: (id: string) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 0,
  loanSummary: EMPTY_LOAN_SUMMARY,
  documents: [],

  setStep: (step) => set({ step }),

  updateLoanSummary: (patch) =>
    set((s) => ({ loanSummary: { ...s.loanSummary, ...patch } })),

  addFiles: (files) => {
    const newDocs: UploadedDocument[] = files.map((file) => ({
      id: uid("doc"),
      file,
      name: file.name,
      size: file.size,
      category: guessCategory(file.name),
      status: "uploading",
      progress: 0,
    }));
    set((s) => ({ documents: [...s.documents, ...newDocs] }));
    return newDocs.map((d) => d.id);
  },

  updateDocumentCategory: (id, category) =>
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, category } : d)),
    })),

  updateDocumentProgress: (id, progress, status) =>
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id
          ? {
              ...d,
              progress,
              status: status ?? (progress >= 100 ? "uploaded" : d.status),
            }
          : d,
      ),
    })),

  removeDocument: (id) =>
    set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

  resetWizard: () =>
    set({ step: 0, loanSummary: EMPTY_LOAN_SUMMARY, documents: [] }),
}));

function guessCategory(filename: string): DocumentCategory {
  const lower = filename.toLowerCase();
  if (/passport|aadhaar|license|identity|id[_-]/.test(lower)) return "identity";
  if (/payslip|salary|income/.test(lower)) return "income";
  if (/bank|statement/.test(lower)) return "bank_statement";
  if (/property|deed|title/.test(lower)) return "property";
  if (/tax|1040|itr/.test(lower)) return "tax_return";
  if (/credit|bureau/.test(lower)) return "credit_report";
  return "other";
}
