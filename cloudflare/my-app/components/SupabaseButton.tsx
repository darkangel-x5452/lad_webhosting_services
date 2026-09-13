"use client";

import { useActionState } from "react";
import {
  insertTestRow,
  type InsertState,
} from "../app/actions/insert-test-row";

const initialState: InsertState = {
  status: "idle",
  message: "",
};

export default function SupabaseButton() {
  const [state, formAction, pending] = useActionState(
    insertTestRow,
    initialState,
  );

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4">
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition duration-200 hover:bg-emerald-500 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        {pending && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
          />
        )}

        {pending ? "Inserting..." : "Insert test row"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-6 break-words text-center text-sm ${
          state.status === "error"
            ? "text-rose-300"
            : "text-emerald-300"
        }`}
      >
        {pending ? "Writing to Supabase..." : state.message}
      </p>
    </form>
  );
}