import { clearSessionCookie } from "../../lib/auth.js";
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
