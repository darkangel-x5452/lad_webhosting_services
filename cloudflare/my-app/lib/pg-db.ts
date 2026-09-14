import "server-only";
import { Client } from "pg";

export function createDbClient(): Client {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in the server environment");
  }

  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

  const client = new Client({
    connectionString: databaseUrl,

    // These pg options use milliseconds.
    connectionTimeoutMillis: 10_000,
    query_timeout: 10_000,

    ssl: {
      rejectUnauthorized: true,
      ...(ca ? { ca } : {}),
    },
  });

  // Handle connection errors that occur outside an active query.
  client.on("error", (error: Error) => {
    console.error("[database] connection error:", error.message);
  });

  return client;
}