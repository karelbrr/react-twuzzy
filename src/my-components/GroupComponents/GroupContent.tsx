import { useParams } from "react-router-dom";
import Message from "../Message";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { motion } from "framer-motion";
import { Error as ErrorDiv } from "../Error";
import { useState } from "react";
import { GroupTextBar } from "./GroupTextBar";
import GroupMessage from "./GroupMessage";

interface Message {
  id: string;
  created_at: string;
  chat_id: string;
  user_id: string;
  message: string;
  media_url: string;
  is_read: boolean;
  is_liked: boolean;
  replied_to: string;
  liked_by: string[];
}

export const GroupContent = () => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const fetchGroupMessages = async (groupId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const { data: messages, error } = useQuery<Message[], Error>({
    queryKey: ["fetchGroupMessages", id],
    queryFn: () => fetchGroupMessages(id!),
  });

  return (
    <div className="h-[80%] lg:h-[72] xl:h-[80%] w-[82%] mt-24 ">
      <motion.section
        className="h-[94%] flex-col  overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <div className="flex flex-col overflow-auto h-full pt-2 pb-5">
          {error && (
            <div className="w-3/4 mx-auto">
              <ErrorDiv error={error?.message} />
            </div>
          )}
          <div className="flex flex-col">
            {messages?.length === 0 && (
              <section className="w-full flex justify-center mt-5">
                <div className="w-1/2 opacity-70 ">
                  <h2 className="text-center text-xl ">No Messages Yet</h2>
                  <p></p>
                </div>
              </section>
            )}
            {messages?.map((message) => (
              <GroupMessage
                key={message.id}
                id={message.id}
                user_id={message.user_id}
                position={message?.user_id === user?.id ? "right" : "left"}
                message={message.message}
                created_at={message.created_at}
                is_liked={message.is_liked}
                replied_to={message.replied_to}
                media_url={message.media_url}
                liked_by={message.liked_by}
                setReplyingTo={setReplyingTo}
              />
            ))}
          </div>
        </div>
      </motion.section>
      <GroupTextBar replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
    </div>
  );
};
