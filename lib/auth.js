import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_EMAIL = "admin@privechat.com";
const COOKIE = "prive_admin_session";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    throw new Error("AUTH_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return process.env.AUTH_SECRET;
}
function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}
function safeEqual(a, b) {
  const aa = Buffer.from(String(a)); const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(raw.split(";").map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf("="); return [x.slice(0, i), decodeURIComponent(x.slice(i + 1))];
  }));
}
export function makeSession(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now()/1000) + MAX_AGE })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function getSession(req) {
  try {
    const token = parseCookies(req)[COOKIE];
    if (!token) return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp < Math.floor(Date.now()/1000) || data.email !== ADMIN_EMAIL) return null;
    return { email: data.email };
  } catch { return null; }
}
export function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session) {
    if (res) res.status(401).json({ error: "Sessão administrativa inválida ou expirada." });
    return null;
  }
  return session;
}
export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secure}`);
}
export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
}
export function checkPassword(password) {
  const configured = process.env.ADMIN_PASSWORD;
  return typeof configured === "string" && configured.length > 0 && safeEqual(password, configured);
}
