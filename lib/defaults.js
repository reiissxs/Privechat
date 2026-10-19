export const DEFAULT_CONFIG = {
  heroUrl: "",
  callVideos: [],
  profiles: [
    { name: "Marina", handle: "@marina", photo: "" },
    { name: "Lívia", handle: "@livia", photo: "" },
    { name: "Helena", handle: "@helena", photo: "" },
    { name: "Clara", handle: "@clara", photo: "" }
  ],
  packs: [
    { coins: 40, price: "R$ 12,90", checkout: "", featured: false },
    { coins: 100, price: "R$ 24,90", checkout: "", featured: false },
    { coins: 140, price: "R$ 14,90", checkout: "", featured: true },
    { coins: 250, price: "R$ 49,90", checkout: "", featured: false },
    { coins: 600, price: "R$ 99,90", checkout: "", featured: false }
  ]
};

export function sanitizeConfig(input) {
  if (!input || typeof input !== "object") throw new Error("Configuração inválida.");
  const profiles = Array.isArray(input.profiles) ? input.profiles : DEFAULT_CONFIG.profiles;
  const packs = Array.isArray(input.packs) ? input.packs : DEFAULT_CONFIG.packs;
  const callVideos = Array.isArray(input.callVideos) ? input.callVideos : [];
  const validUrl = (value) => {
    if (!value) return "";
    const url = new URL(String(value));
    if (url.protocol !== "https:") throw new Error("Todos os links precisam usar HTTPS.");
    return url.toString();
  };
  return {
    heroUrl: validUrl(input.heroUrl || ""),
    callVideos: callVideos.map(validUrl),
    profiles: profiles.slice(0, 200).map((p) => ({
      name: String(p?.name || "").slice(0, 100),
      handle: String(p?.handle || "").slice(0, 100),
      photo: p?.photo ? validUrl(p.photo) : ""
    })),
    packs: packs.slice(0, 20).map((p) => ({
      coins: Math.max(1, Math.min(1000000, Math.floor(Number(p?.coins) || 1))),
      price: String(p?.price || "").slice(0, 40),
      checkout: validUrl(p?.checkout || ""),
      featured: Boolean(p?.featured)
    }))
  };
}
