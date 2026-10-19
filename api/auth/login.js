import { ADMIN_EMAIL, checkPassword, makeSession, setSessionCookie } from "../../lib/auth.js";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (email !== ADMIN_EMAIL || !checkPassword(password)) {
    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  }
  try {
    setSessionCookie(res, makeSession(ADMIN_EMAIL));
    return res.status(200).json({ admin: true, email: ADMIN_EMAIL });
  } catch (err) {
    console.error("login API:", err.message);
    return res.status(500).json({ error: "A autenticação ainda não está configurada no servidor." });
  }
}
