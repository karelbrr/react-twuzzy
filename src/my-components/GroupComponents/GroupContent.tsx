import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { motion } from "framer-motion";
import { Error as ErrorDiv } from "../Error";
import { useEffect, useRef, useState } from "react";
import { GroupTextBar } from "./GroupTextBar";
import GroupMessage from "./GroupMessage";
import { Helmet } from "react-helmet-async";

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
  const queryClient = useQueryClient();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 400;
    const distanceFromTop = container.scrollTop + container.clientHeight;
    const distanceFromBottom = container.scrollHeight - distanceFromTop;
    setIsNearBottom(distanceFromBottom < threshold);
  };

  const fetchGroupMessages = async (groupId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: messages,
    error,
  } = useQuery<Message[], Error>({
    queryKey: ["fetchGroupMessages", id],
    queryFn: () => fetchGroupMessages(id!),
  });

  const fetchGroupName = async (groupId: string): Promise<string> => {
    const { data, error } = await supabase
      .from("groups")
      .select("group_name")
      .eq("id", groupId)
      .single();
    if (error) throw new Error(error.message);
    return data.group_name;
  };

  const { data: groupName } = useQuery<string, Error>({
    queryKey: ["fetchGroupName", id],
    queryFn: () => fetchGroupName(id!),
    enabled: !!id,
  });

  // 🚀 Realtime sync with Supabase
  useEffect(() => {
    if (!id) return;

    const subscription = supabase
      .channel("realtime:group_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages" },
        (payload) => {
          if (payload.new.group_id !== id) return;

          queryClient.setQueryData<Message[]>(
            ["fetchGroupMessages", id],
            (old) => [...(old || []), payload.new as Message]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "group_messages" },
        (payload) => {
          if (payload.new.group_id !== id) return;

          queryClient.setQueryData<Message[]>(
            ["fetchGroupMessages", id],
            (old) =>
              old?.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              ) || []
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "group_messages" },
        (payload) => {
          queryClient.setQueryData<Message[]>(
            ["fetchGroupMessages", id],
            (old) => old?.filter((msg) => msg.id !== payload.old.id) || []
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id, queryClient]);

  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isNearBottom]);

  return (
    <div className="h-[80%] lg:h-[72] xl:h-[80%] w-[82%] mt-24 ">
      <Helmet>
        <title>{groupName || "groupname"} | Twüzzy</title>
      </Helmet>

      <motion.section
        className="h-[94%] flex-col overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <div
          className="flex flex-col overflow-auto h-full pt-2 pb-5"
          onScroll={handleScroll}
          ref={messagesContainerRef}
        >
          {error && (
            <div className="w-3/4 mx-auto">
              <ErrorDiv error={error?.message} />
            </div>
          )}
          <div className="flex flex-col">
            {messages?.length === 0 && (
              <section className="w-full flex justify-center mt-5">
                <div className="w-1/2 opacity-70 ">
                  <h2 className="text-center text-xl">No Messages Yet</h2>
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
            <div ref={messagesEndRef} />
          </div>
        </div>
      </motion.section>

      <GroupTextBar replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
    </div>
  );
};
