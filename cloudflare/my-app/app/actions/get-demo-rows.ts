"use server";

import { getDb } from "../../lib/db";

export type DemoRow = {
  id: string;
  message: string;
  created_at: string;
};

type DatabaseRow = Omit<DemoRow, "created_at"> & {
  created_at: Date;
};

type GetRowsResult =
  | { ok: true; rows: DemoRow[] }
  | { ok: false; error: string };

export async function getDemoRows(): Promise<GetRowsResult> {
  // Same local-only restriction as the earlier insert demo.
  // Replace with authentication AND authorization before deployment.
  // if (process.env.NODE_ENV !== "development") {
  //   return {
  //     ok: false,
  //     error: "This demo is development-only. Add authentication before deploying.",
  //   };
  // }

  try {
    const sql = getDb();

    const rows = await sql<DatabaseRow[]>`
      select *
      from app_private.insert_demo
      order by created_at desc, id desc
    `;

    // Return a plain array with only the fields the UI needs.
    return {
      ok: true,
      rows: Array.from(rows, (row) => ({
        id: row.id,
        message: row.message,
        created_at: row.created_at.toISOString(),
      })),
    };
  } catch (error: unknown) {
    console.error(
      "Database select failed:",
      error instanceof Error ? error.message : "Unknown database error",
    );

    return {
      ok: false,
      error: "Could not load rows. Check your Next.js terminal.",
    };
  }
}