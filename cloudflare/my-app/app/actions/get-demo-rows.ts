"use server";

import { createDbClient } from "@/lib/pg-db";

// Keep your existing DemoRow, DatabaseRow and GetRowsResult types here.
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
  let client: ReturnType<typeof createDbClient> | undefined;
  let stage = "create client";

  try {
    // Create a fresh client inside this action.
    client = createDbClient();

    stage = "connect";
    console.info("[database] connecting");

    await client.connect();

    console.info("[database] connected");

    // Temporary connection test.
    stage = "SELECT 1";
    const probe = await client.query<{ ok: number }>(
      "SELECT 1 AS ok",
    );

    console.info("[database] probe result:", probe.rows);

    // Your actual table query.
    stage = "select demo rows";
    const result = await client.query<DatabaseRow>(`
      SELECT id, message, created_at
      FROM app_private.insert_demo
      ORDER BY created_at DESC, id DESC
    `);

    stage = "serialize rows";
    return {
      ok: true,
      rows: result.rows.map((row) => ({
        id: row.id,
        message: row.message,
        created_at: row.created_at.toISOString(),
      })),
    };
  } catch (error: unknown) {
    console.error("[database] failed", {
      stage,
      message:
        error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      ok: false,
      error: "Could not load rows. Check the server logs.",
    };
  } finally {
    // Close this action's client, including after a failed query.
    if (client) {
      try {
        await client.end();
      } catch {
        console.warn("[database] connection cleanup failed");
      }
    }
  }
}