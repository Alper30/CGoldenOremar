"use client";

import { type ReactNode, useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortAccessor?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  className?: string;
};

const norm = (s: string) => s.toLocaleLowerCase("tr").replace(/[ıİ]/g, "i");

export function DataTable<T>({
  rows,
  columns,
  searchable = true,
  searchAccessor,
  searchPlaceholder = "Ara…",
  pageSize = 10,
  emptyText = "Kayıt bulunamadı",
  toolbar,
  rowAction,
}: {
  rows: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchAccessor?: (row: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyText?: string;
  toolbar?: ReactNode;
  rowAction?: (row: T) => ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let r = rows;
    if (q && searchAccessor) {
      const nq = norm(q);
      r = r.filter((row) => norm(searchAccessor(row)).includes(nq));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortAccessor) {
        const acc = col.sortAccessor;
        r = [...r].sort((a, b) => {
          const av = acc(a);
          const bv = acc(b);
          if (av < bv) return -1 * sort.dir;
          if (av > bv) return 1 * sort.dir;
          return 0;
        });
      }
    }
    return r;
  }, [rows, q, sort, columns, searchAccessor]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const view = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (key: string) =>
    setSort((s) =>
      s?.key === key
        ? s.dir === 1
          ? { key, dir: -1 }
          : null
        : { key, dir: 1 },
    );

  return (
    <div className="rounded-2xl border border-line bg-card">
      {(searchable || toolbar) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
          {searchable && (
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-full border border-line bg-cream pl-9 pr-3 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              {columns.map((c) => {
                const active = sort?.key === c.key;
                const sortable = !!c.sortAccessor;
                return (
                  <th
                    key={c.key}
                    onClick={sortable ? () => toggleSort(c.key) : undefined}
                    className={`px-4 py-3 font-semibold ${
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""
                    } ${sortable ? "cursor-pointer select-none hover:text-forest" : ""}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.header}
                      {sortable && (
                        <span className={active ? "text-gold" : "text-line"}>
                          {active ? (sort!.dir === 1 ? "↑" : "↓") : "↕"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              {rowAction && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {view.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowAction ? 1 : 0)} className="px-4 py-12 text-center text-muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              view.map((row, i) => (
                <tr key={i} className="border-b border-line/70 last:border-0 hover:bg-cream/60">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 text-forest-deep ${
                        c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""
                      } ${c.className ?? ""}`}
                    >
                      {c.render ? c.render(row) : null}
                    </td>
                  ))}
                  {rowAction && <td className="px-4 py-3 text-right">{rowAction(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between gap-3 border-t border-line p-3 text-xs text-muted">
          <span>
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, filtered.length)} / {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
              className="rounded-full border border-line px-3 py-1.5 font-semibold text-forest disabled:opacity-40"
            >
              Önceki
            </button>
            <span className="px-2 font-semibold text-forest-deep">
              {safePage + 1} / {pageCount}
            </span>
            <button
              onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
              disabled={safePage >= pageCount - 1}
              className="rounded-full border border-line px-3 py-1.5 font-semibold text-forest disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
