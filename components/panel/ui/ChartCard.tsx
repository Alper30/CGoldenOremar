"use client";

import type { ReactNode } from "react";

export function ChartCard({
  title,
  subtitle,
  action,
  isEmpty,
  emptyText = "Henüz veri yok",
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  isEmpty?: boolean;
  emptyText?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border border-line bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base text-forest-deep">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-muted">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 3v18h18" strokeLinecap="round" />
              <path d="M7 14l3-3 3 3 4-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm text-muted">{emptyText}</p>
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </div>
  );
}
