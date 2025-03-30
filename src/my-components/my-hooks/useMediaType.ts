import { useMemo } from "react";

export const useMediaType = (url: string | null | undefined): "image" | "audio" | "file" | "unknown" => {
  return useMemo(() => {
    if (!url) return "unknown";

    // Odstraníme query parametry, např. "?token=..."
    const cleanUrl = url.split("?")[0];

    // Vytáhneme příponu
    const extension = cleanUrl.split(".").pop()?.toLowerCase();

    if (!extension) return "unknown";

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) return "image";
    if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
    if (["pdf", "docx", "xlsx", "zip", "txt"].includes(extension)) return "file";

    return "file"; // fallback
  }, [url]);
};
