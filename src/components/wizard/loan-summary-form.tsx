"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "@/store/useWizardStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const LOAN_TYPES = [
  "Home Loan",
  "Personal Loan",
  "Auto Loan",
  "Business Loan",
  "Education Loan",
];
const EMPLOYMENT_TYPES = [
  "Salaried",
  "Self-Employed",
  "Business Owner",
  "Retired",
  "Other",
];

export function LoanSummaryForm() {
  const { loanSummary, updateLoanSummary } = useWizardStore();

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
          <CardTitle>Applicant Details</CardTitle>
          <CardDescription>
            Basic information about the person requesting the loan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="applicantName">Full Name</Label>
            <Input
              id="applicantName"
              placeholder="Jane Doe"
              value={loanSummary.applicantName}
              onChange={(e) =>
                updateLoanSummary({ applicantName: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={loanSummary.email}
              onChange={(e) => updateLoanSummary({ email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1 555 000 1234"
              value={loanSummary.phone}
              onChange={(e) => updateLoanSummary({ phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select
              id="employmentType"
              value={loanSummary.employmentType}
              onChange={(e) =>
                updateLoanSummary({ employmentType: e.target.value })
              }
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Request</CardTitle>
          <CardDescription>
            What the applicant is asking for, and why.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="loanType">Loan Type</Label>
              <Select
                id="loanType"
                value={loanSummary.loanType}
                onChange={(e) =>
                  updateLoanSummary({ loanType: e.target.value })
                }
              >
                {LOAN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="loanTenureMonths">Tenure (months)</Label>
              <Input
                id="loanTenureMonths"
                type="number"
                min={6}
                step={6}
                value={loanSummary.loanTenureMonths}
                onChange={(e) =>
                  updateLoanSummary({
                    loanTenureMonths: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="loanAmount" className="mb-0">
                Requested Loan Amount
              </Label>
              <span className="text-sm font-medium text-google-blue-hover">
                {formatCurrency(loanSummary.loanAmount)}
              </span>
            </div>
            <input
              id="loanAmount"
              type="range"
              min={1000}
              max={1000000}
              step={1000}
              value={loanSummary.loanAmount}
              onChange={(e) =>
                updateLoanSummary({ loanAmount: Number(e.target.value) })
              }
              className="w-full accent-[var(--google-blue)]"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="monthlyIncome" className="mb-0">
                Declared Monthly Income
              </Label>
              <span className="text-sm font-medium text-google-blue-hover">
                {formatCurrency(loanSummary.monthlyIncome)}
              </span>
            </div>
            <input
              id="monthlyIncome"
              type="range"
              min={500}
              max={50000}
              step={100}
              value={loanSummary.monthlyIncome}
              onChange={(e) =>
                updateLoanSummary({ monthlyIncome: Number(e.target.value) })
              }
              className="w-full accent-[var(--google-blue)]"
            />
          </div>

          <div>
            <Label htmlFor="purpose">Purpose of Loan</Label>
            <Textarea
              id="purpose"
              rows={2}
              placeholder="e.g. Purchasing a primary residence in Austin, TX"
              value={loanSummary.purpose}
              onChange={(e) => updateLoanSummary({ purpose: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="existingLiabilities">Existing Liabilities</Label>
            <Textarea
              id="existingLiabilities"
              rows={2}
              placeholder="e.g. Car loan $12,000 remaining, credit card balance $2,500"
              value={loanSummary.existingLiabilities}
              onChange={(e) =>
                updateLoanSummary({ existingLiabilities: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Anything else the verification agents should know"
              value={loanSummary.notes}
              onChange={(e) => updateLoanSummary({ notes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
