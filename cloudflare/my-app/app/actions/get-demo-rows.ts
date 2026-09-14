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
  // Local diagnostic only until authentication and authorization are added.
  let sql: ReturnType<typeof getDb> | undefined;
  let stage = "configuration";

  try {
    console.info("[database configuration]", {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasCaCertificate: Boolean(
        process.env.DATABASE_CA_CERT?.includes(
          "-----BEGIN CERTIFICATE-----",
        ),
      ),
    });

    sql = getDb();

    // Temporary diagnostic: remove after the connection is working.
    stage = "connection / SELECT 1";
    await sql`SELECT 1 AS ok`;
    console.info("[database] SELECT 1 succeeded");

    stage = "select demo rows";
    const rows = await sql<DatabaseRow[]>`
      SELECT id, message, created_at
      FROM app_private.insert_demo
      ORDER BY created_at DESC, id DESC
    `;

    stage = "serialize rows";
    return {
      ok: true,
      rows: Array.from(rows, (row) => ({
        id: row.id,
        message: row.message,
        created_at: row.created_at.toISOString(),
      })),
    };
  } catch (error: unknown) {
    // Log selected diagnostic fields, not the entire database error/client.
    if (error instanceof Error) {
      console.error("[database]", {
        stage,
        message: error.message,
        code:
          "code" in error && typeof error.code === "string"
            ? error.code
            : undefined,
        stack: error.stack,
      });

      if (error.cause instanceof Error) {
        console.error("[database cause]", {
          message: error.cause.message,
          stack: error.cause.stack,
        });
      }
    } else {
      console.error("[database]", {
        stage,
        message: "Unknown database error",
      });
    }

    return {
      ok: false,
      error: "Could not load rows. Check the server logs.",
    };
  } finally {
    if (sql) {
      try {
        await sql.end({ timeout: 5 });
      } catch {
        // Do not replace the original query result/error with a cleanup error.
        console.warn("[database] Client cleanup failed");
      }
    }
  }
}