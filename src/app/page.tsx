"use client";

import { useMemo } from "react";
import { useRunsStore } from "@/store/useRunsStore";
import { Hero } from "@/components/dashboard/hero";
import { StatCards } from "@/components/dashboard/stat-cards";
import { RecentRuns } from "@/components/dashboard/recent-runs";

export default function DashboardPage() {
  const order = useRunsStore((s) => s.order);
  const runsMap = useRunsStore((s) => s.runs);
  const runs = useMemo(
    () => order.map((id) => runsMap[id]).filter(Boolean),
    [order, runsMap],
  );

  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <div className="mx-auto -mt-2 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <StatCards runs={runs} />
      </div>
      <div className="mt-12">
        <RecentRuns runs={runs} />
      </div>
    </div>
  );
}
