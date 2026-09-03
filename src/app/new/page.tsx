"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import { Stepper } from "@/components/wizard/stepper";
import { LoanSummaryForm } from "@/components/wizard/loan-summary-form";
import { DocumentUploader } from "@/components/wizard/document-uploader";
import { ReviewStep } from "@/components/wizard/review-step";
import { Button } from "@/components/ui/button";

export default function NewAnalysisPage() {
  const { step, setStep, loanSummary } = useWizardStore();

  const canProceedFromStep0 =
    loanSummary.applicantName.trim().length > 0 && loanSummary.loanAmount > 0;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          New Loan Analysis
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Provide the applicant&apos;s loan summary and supporting documents to
          kick off verification.
        </p>
      </div>

      <div className="mb-8">
        <Stepper step={step} />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && <LoanSummaryForm key="step-0" />}
        {step === 1 && <DocumentUploader key="step-1" />}
        {step === 2 && <ReviewStep key="step-2" />}
      </AnimatePresence>

      {step < 2 && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !canProceedFromStep0}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <Button variant="secondary" onClick={() => setStep(1)}>
            <ArrowLeft className="h-4 w-4" /> Back to Documents
          </Button>
        </div>
      )}
    </div>
  );
}
