"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Loader2, ShieldCheck } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import { submitLoanForAnalysis } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DOCUMENT_CATEGORIES } from "@/lib/types";
import { formatBytes, formatCurrency } from "@/lib/utils";

export function ReviewStep() {
  const router = useRouter();
  const { loanSummary, documents, resetWizard } = useWizardStore();
  const [submitting, setSubmitting] = useState(false);

  const categoryLabel = (value: string) =>
    DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  async function handleSubmit() {
    setSubmitting(true);
    const { runId } = await submitLoanForAnalysis({
      loanSummary,
      documents: documents.map((d) => ({
        id: d.id,
        name: d.name,
        size: d.size,
        category: d.category,
      })),
    });
    resetWizard();
    router.push(`/analysis/${runId}`);
  }

  const fields: [string, string][] = [
    ["Applicant", loanSummary.applicantName || "—"],
    ["Email", loanSummary.email || "—"],
    ["Phone", loanSummary.phone || "—"],
    ["Employment", loanSummary.employmentType],
    ["Loan Type", loanSummary.loanType],
    ["Loan Amount", formatCurrency(loanSummary.loanAmount)],
    ["Tenure", `${loanSummary.loanTenureMonths} months`],
    ["Monthly Income", formatCurrency(loanSummary.monthlyIncome)],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      <Card>
        <CardHeader>
          <CardTitle>Review Application</CardTitle>
          <CardDescription>
            Confirm the details below before sending them to the workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-foreground-muted">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          {loanSummary.purpose && (
            <div className="mt-4 border-t border-border pt-4">
              <dt className="text-xs text-foreground-muted">Purpose</dt>
              <dd className="mt-0.5 text-sm text-foreground">
                {loanSummary.purpose}
              </dd>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents ({documents.length})</CardTitle>
          <CardDescription>
            These files will be sent to the document intake agent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              No documents attached.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border px-3.5 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-foreground-muted" />
                    <span className="truncate text-sm text-foreground">
                      {doc.name}
                    </span>
                    <span className="shrink-0 text-xs text-foreground-muted">
                      {formatBytes(doc.size)}
                    </span>
                  </div>
                  <Badge tone="blue">{categoryLabel(doc.category)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-google-blue/25 bg-google-blue-tint px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-google-blue-hover" />
          <p className="text-sm text-foreground">
            Submitting will start the agentic verification workflow. You&apos;ll
            be able to watch every step live.
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full shrink-0 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit for Analysis"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
