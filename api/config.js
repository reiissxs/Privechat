import { readConfig, writeConfig } from "../lib/db.js";
import { requireAdmin } from "../lib/auth.js";
import { sanitizeConfig } from "../lib/defaults.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  try {
    if (req.method === "GET") return res.status(200).json(await readConfig());
    if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
    if (!requireAdmin(req, res)) return;
    const config = sanitizeConfig(req.body);
    await writeConfig(config);
    return res.status(200).json({ ok: true, config });
  } catch (err) {
    console.error("config API:", err.message);
    return res.status(500).json({ error: err.message || "Erro ao salvar configuração." });
  }
}
