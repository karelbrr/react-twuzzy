import { useState } from "react";

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      setError(null);

      
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setError("Failed to copy text");
      setIsCopied(false);
    }
  };

  return { copyToClipboard, isCopied, error };
}
