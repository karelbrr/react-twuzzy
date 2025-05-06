import { useMutation } from "@tanstack/react-query";
import { supabase } from "./createClient";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const blockUser = async ({
  blockerId,
  blockedId,
}: {
  blockerId: string;
  blockedId: string;
}) => {
  const { error } = await supabase.from("blocked_users").insert([
    {
      blocker_id: blockerId,
      blocked_id: blockedId,
    },
  ]);

  if (error) throw new Error(error.message);
};

const blockUserAndDeleteChat = async ({
  blockerId,
  blockedId,
  chatId,
}: {
  blockerId: string | undefined;
  blockedId: string | undefined;
  chatId: string | undefined;
}) => {
  const { error: insertError } = await supabase.from("blocked_users").insert([
    {
      blocker_id: blockerId,
      blocked_id: blockedId,
    },
  ]);

  if (insertError) throw new Error(insertError.message);

  const { error: deleteError } = await supabase
    .from("chats")
    .delete()
    .eq("id", chatId);

  if (deleteError) throw new Error(deleteError.message);
};

export const useBlockUser = () =>
  useMutation({
    mutationFn: blockUser,
    onError: (error: Error) => {
      toast({ description: `Error blocking user: ${error.message}` });
    },
    onSuccess: () => {
      toast({ description: `Successfully blocked user` });
    },
  });

export const useBlockUserAndDeleteChat = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: blockUserAndDeleteChat,
    onError: (error: Error) => {
      toast({ description: `Error blocking user: ${error.message}` });
    },
    onSuccess: () => {
      toast({ description: `User blocked and chat deleted` });
      navigate("/");
    },
  });
};
