"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";

function toneFor(score: number) {
  if (score <= 45) return "var(--google-green)";
  if (score <= 70) return "var(--google-yellow)";
  return "var(--google-red)";
}

export function RiskGauge({ score }: { score: number }) {
  const color = toneFor(score);
  const data = [{ name: "risk", value: score, fill: color }];

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <RadialBarChart
        width={160}
        height={160}
        cx="50%"
        cy="50%"
        innerRadius="72%"
        outerRadius="100%"
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          dataKey="value"
          angleAxisId={0}
          cornerRadius={10}
          background={{ fill: "var(--surface-hover)" }}
        />
      </RadialBarChart>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-3xl font-semibold tracking-tight"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-[11px] text-foreground-muted">risk score</span>
      </div>
    </div>
  );
}
