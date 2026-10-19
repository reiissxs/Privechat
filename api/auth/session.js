import { getSession } from "../../lib/auth.js";
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const session = getSession(req);
  if (!session) return res.status(401).json({ admin: false });
  return res.status(200).json({ admin: true, email: session.email });
}
