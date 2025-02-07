import { useQuery } from "@tanstack/react-query";
import { supabase } from "./createClient";

interface RepliedToMessageProps {
  id: string;
  message: string;
  replied_to: string | null;
}

const useRepliedMessage = (replied_to: string | null) => {
  return useQuery<RepliedToMessageProps | null, Error>({
    queryKey: ["repliedMessageFetch", replied_to],
    queryFn: async () => {
      if (!replied_to) return null; // pokud není `replied_to`, neprovádí žádný fetch

      const { data, error } = await supabase
        .from("messages")
        .select("id,message,replied_to")
        .eq("id", replied_to)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!replied_to, 
  });
};

export default useRepliedMessage;
