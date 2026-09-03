"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PauseCircle, PlayCircle, Terminal } from "lucide-react";
import type { WorkflowEvent, WorkflowEventLevel } from "@/lib/types";
import { EVENT_LEVEL_META } from "@/lib/status";
import { formatTime, cn } from "@/lib/utils";

const FILTERS: { value: WorkflowEventLevel | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
];

export function EventConsole({
  events,
  live,
}: {
  events: WorkflowEvent[];
  live: boolean;
}) {
  const [filter, setFilter] = useState<WorkflowEventLevel | "all">("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "all" ? events : events.filter((e) => e.level === filter);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered.length, autoScroll]);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-[#0b0e14] shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-white/70" />
          <span className="text-sm font-medium text-white">Live Events</span>
          {live && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-google-green">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-google-green" />{" "}
              streaming
            </span>
          )}
          <span className="text-[11px] text-white/40">
            {events.length} events
          </span>
        </div>

        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                filter === f.value
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setAutoScroll((v) => !v)}
            aria-label="Toggle autoscroll"
            className="ml-1 flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white/50 transition-colors hover:text-white/80 cursor-pointer"
          >
            {autoScroll ? (
              <PauseCircle className="h-3.5 w-3.5" />
            ) : (
              <PlayCircle className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[520px] min-h-[280px] overflow-y-auto px-2 py-2 font-mono text-[12.5px]"
      >
        {filtered.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-white/30">
            Waiting for events…
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((event) => {
              const meta = EVENT_LEVEL_META[event.level];
              const expanded = expandedId === event.id;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-md px-2 py-1.5 hover:bg-white/5"
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : event.id)}
                    className="flex w-full cursor-pointer items-start gap-2 text-left"
                  >
                    <span className="mt-0.5 shrink-0 text-white/30">
                      {formatTime(event.timestamp)}
                    </span>
                    <span
                      className={cn(
                        "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                        meta.tone === "blue" && "bg-google-blue",
                        meta.tone === "green" && "bg-google-green",
                        meta.tone === "yellow" && "bg-google-yellow",
                        meta.tone === "red" && "bg-google-red",
                      )}
                    />
                    <span className="shrink-0 text-white/40">
                      [{event.agentName}]
                    </span>
                    <span className="min-w-0 flex-1 truncate text-white/90">
                      {event.title}
                    </span>
                    {event.payload && (
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30 transition-transform",
                          expanded && "rotate-180",
                        )}
                      />
                    )}
                  </button>
                  <div className="pl-[4.9rem] text-white/50">
                    {event.message}
                  </div>
                  <AnimatePresence>
                    {expanded && event.payload && (
                      <motion.pre
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-[4.9rem] mt-1 overflow-hidden rounded bg-white/5 p-2 text-[11px] text-white/60"
                      >
                        {JSON.stringify(event.payload, null, 2)}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
