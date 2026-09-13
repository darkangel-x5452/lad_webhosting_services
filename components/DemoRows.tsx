"use client";

import { useState } from "react";
import {
  getDemoRows,
  type DemoRow,
} from "../app/actions/get-demo-rows";

export default function DemoRows() {
  const [rows, setRows] = useState<DemoRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRows() {
    setLoading(true);
    setError(null);
    setRows(null);

    try {
      const result = await getDemoRows();

      if (!result.ok) {
        throw new Error(result.error);
      }

      setRows(result.rows);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Unable to load rows.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-4xl space-y-4">
      <button
        type="button"
        onClick={loadRows}
        disabled={loading}
        aria-busy={loading}
        className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        {loading ? "Loading..." : "Load rows"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className="text-sm text-slate-300"
      >
        {loading
          ? "Loading rows..."
          : rows !== null
            ? `${rows.length} row(s) loaded.`
            : "Click Load rows to read the table."}
      </p>

      {error && (
        <p role="alert" className="text-rose-300">
          {error}
        </p>
      )}

      {rows !== null && rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Rows from insert_demo
            </caption>

            <thead className="bg-white/10">
              <tr>
                <th scope="col" className="p-3">ID</th>
                <th scope="col" className="p-3">Message</th>
                <th scope="col" className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="p-3 font-mono text-xs">
                    {row.id}
                  </td>
                  <td className="p-3">
                    {row.message}
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}