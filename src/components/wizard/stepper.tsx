"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Loan Details", "Documents", "Review & Submit"];

export function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const isActive = i === step;
        const isDone = i < step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300",
                  isDone
                    ? "border-google-blue bg-google-blue text-white"
                    : isActive
                      ? "border-google-blue text-google-blue-hover animate-pulse-ring"
                      : "border-border text-foreground-muted",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive || isDone
                    ? "text-foreground"
                    : "text-foreground-muted",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border sm:mx-4">
                <div
                  className="h-full bg-google-blue transition-all duration-500 ease-out"
                  style={{ width: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
