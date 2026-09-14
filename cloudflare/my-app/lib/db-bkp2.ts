import "server-only";
import postgres from "postgres";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in the server environment");
  }

  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

  // A new client for this invocation.
  // Do not store this client on globalThis or at module scope.
  return postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
    ssl: {
      rejectUnauthorized: true,
      ...(ca ? { ca } : {}),
    },
  });
}