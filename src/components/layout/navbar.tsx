"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/new", label: "New Analysis" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-google-blue-tint text-google-blue-hover transition-transform group-hover:scale-105">
            <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
          </span>
          <span className="text-[17px] font-medium tracking-tight text-foreground">
            Verif<span className="text-google-blue">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-google-blue-hover"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-hover",
                )}
              >
                {active && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-google-blue-tint animate-scale-in" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/new"
            className="hidden items-center gap-1.5 rounded-full bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-soft transition-all hover:bg-google-blue-hover hover:shadow-elevated active:scale-[0.97] sm:flex"
          >
            <Plus className="h-4 w-4" />
            New Analysis
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
