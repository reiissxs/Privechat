import { handleUpload } from "@vercel/blob/client";
import { getSession } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  try {
    const result = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!getSession(req)) throw new Error("Apenas o administrador pode enviar arquivos.");
        const parsed = clientPayload ? JSON.parse(clientPayload) : {};
        const type = String(parsed.contentType || "");
        if (!/^(video\/(mp4|webm|quicktime)|image\/(jpeg|png|webp|gif))$/i.test(type)) {
          throw new Error("Formato de arquivo não permitido.");
        }
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ admin: true })
        };
      },
      onUploadCompleted: async () => {}
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message || "Falha no envio do arquivo." });
  }
}
