import "server-only";

import { neon } from "@neondatabase/serverless";

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  return neon(databaseUrl);
}
