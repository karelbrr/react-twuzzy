import { ProfileDescInContent } from "./profileDescInContent";
import { useParams } from "react-router-dom";
import Message from "./Message";
import { TextBar } from "../my-components/TextBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Error as ErrorDiv } from "./Error";

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
}

export const Content = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleScroll = () => {
    if (!messagesContainerRef.current) {
      return;
    }

    const container = messagesContainerRef.current;

    const threshold = 400;
    const distanceFromTop = container.scrollTop + container.clientHeight;
    const distanceFromBottom = container.scrollHeight - distanceFromTop;

    setIsNearBottom(distanceFromBottom < threshold);
  };

  const fetchMessages = async (chatId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const { data: messages, error } = useQuery<Message[], Error>({
    queryKey: ["fetchMessages", id],
    queryFn: () => fetchMessages(id!),
  });


  useEffect(() => {
    const subscription = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.chat_id !== id) return;
          queryClient.setQueryData<Message[]>(
            ["fetchMessages", id],
            (oldData) => [...(oldData || []), payload.new as Message]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.chat_id !== id) return;
          queryClient.setQueryData<Message[]>(
            ["fetchMessages", id],
            (oldData) => {
              return oldData?.map((message) =>
                message.id === payload.new.id
                  ? (payload.new as Message)
                  : message
              );
            }
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          queryClient.setQueryData<Message[]>(
            ["fetchMessages", id],
            (oldData) =>
              oldData?.filter((message) => message.id !== payload.old.id) || []
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, id, messages, isNearBottom, messagesEndRef]);

  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-[80%] lg:h-[72] xl:h-[80%] w-[82%] mt-24 ">
      <motion.section
        className="h-[94%] flex-col  overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <div
          ref={messagesContainerRef}
          className="flex flex-col overflow-auto h-full pt-2 pb-5"
          onScroll={handleScroll}
        >
          <ProfileDescInContent />
          {error && (
            <div className="w-3/4 mx-auto">
              <ErrorDiv error={error?.message} />
            </div>
          )}
          <div className="flex flex-col">
            {messages?.map((item) => (
              <Message
                key={item.id}
                id={item.id}
                position={item?.user_id === user?.id ? "right" : "left"}
                message={item.message}
                created_at={item.created_at}
                is_liked={item.is_liked}
                replied_to={item.replied_to}
                media_url={item.media_url}
                setReplyingTo={setReplyingTo}
              />
            ))}

            {messages?.length === 0 && (
              <section className="w-full flex justify-center">
                <div className="w-1/2 opacity-70 mt-4">
                  <h2 className="text-center text-xl font-medium">
                    No Messages Yet
                  </h2>
                  <p className="text-justify opacity-65">
                    It seems like there are no messages in this chat yet. Be the
                    first to start the conversation! Type a message below and
                    hit send to break the silence. 😊
                  </p>
                </div>
              </section>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </motion.section>
      <TextBar replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
    </div>
  );
};
