"use server";

import { getDb } from "../../lib/db";

export type InsertState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function insertTestRow(
  _previousState: InsertState,
  _formData: FormData,
): Promise<InsertState> {
  // This connectivity test does not authenticate website users.
  // Replace this guard with real authentication and authorization
  // before deployment. Do not simply remove it.
  if (process.env.NODE_ENV !== "development") {
    return {
      status: "error",
      message: "This test is development-only. Add authentication before deploying.",
    };
  }

  try {
    const sql = getDb();
    // Customise the message for inserts.
    const message = "Hello from Next.js";

    const [row] = await sql<{ id: string }[]>`
      insert into app_private.insert_demo (message)
      values (${message})
      returning id
    `;

    if (!row) {
      throw new Error("Insert did not return a row ID");
    }

    return {
      status: "success",
      message: `Inserted row: ${row.id}`,
    };
  } catch (error: unknown) {
    console.error(
      "Database insert failed:",
      error instanceof Error ? error.message : "Unknown database error",
    );

    return {
      status: "error",
      message: "Insert failed. Check the terminal running Next.js for details.",
    };
  }
}