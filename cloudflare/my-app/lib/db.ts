import "server-only";
import postgres from "postgres";

const globalForDb = globalThis as unknown as {
  insertDemoSql?: ReturnType<typeof postgres>;
};

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  
  console.info("[trial env var2]", process.env.TRIAL_ENV_VAR);
  
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in .env.local");
  }
  console.log(
    "Database CA certificate loaded:",
    Boolean(process.env.DATABASE_CA_CERT?.includes("-----BEGIN CERTIFICATE-----")),
  );

  // Reuse the connection pool during development hot reloads.
  globalForDb.insertDemoSql ??= postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n"),
    },
  });


  return globalForDb.insertDemoSql;
}