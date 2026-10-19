import { neon } from "@neondatabase/serverless";
import { DEFAULT_CONFIG } from "./defaults.js";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
const sql = neon(process.env.DATABASE_URL);
let initPromise;

export async function ensureDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS prive_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`INSERT INTO prive_settings (id, data) VALUES (1, ${JSON.stringify(DEFAULT_CONFIG)}::jsonb)
        ON CONFLICT (id) DO NOTHING`;
    })().catch((err) => { initPromise = null; throw err; });
  }
  await initPromise;
}

export async function readConfig() {
  await ensureDatabase();
  const rows = await sql`SELECT data FROM prive_settings WHERE id = 1 LIMIT 1`;
  return rows[0]?.data || DEFAULT_CONFIG;
}

export async function writeConfig(data) {
  await ensureDatabase();
  await sql`INSERT INTO prive_settings (id, data, updated_at)
    VALUES (1, ${JSON.stringify(data)}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;
  return { ok: true, updatedAt: new Date().toISOString() };
}
