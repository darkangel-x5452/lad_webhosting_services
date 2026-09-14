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
  //     error: "1This demo is development-only. Add authentication before deploying.",
  //   };
  // }

  console.info("[trial env var1]", process.env.TRIAL_ENV_VAR);
  
  console.info("[database configuration]", {
    hasDatabaseUrl:
      typeof process !== "undefined" &&
      Boolean(process.env.DATABASE_URL),
  });
  

  try {
    console.info("Trying DB")
    const sql = getDb();
    
    console.info("awaiting sql")
    const rows = await sql<DatabaseRow[]>`
    select *
    from app_private.insert_demo
    order by created_at desc, id desc
    `;
    
    console.info("returning sql")
    
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
    console.info("error", error)
    if (error instanceof Error) {
      // Catch granular errors.
      console.error("[database] message:", error.message);
      console.error("[database] stack:", error.stack);
      
      if (error.cause instanceof Error) {
        console.error("[database] cause:", error.cause.stack);
      }
    }
    // Keep your existing error-handling behaviour below.
    console.error(
      "Database select failed:",
      error instanceof Error ? error.message : "Unknown database error",
    );
    console.info("returning result")
    
    return {
      ok: false,
      error: "Could not load rows. Check your Next.js terminal.",
    };
  }
}