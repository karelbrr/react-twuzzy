import { useParams } from "react-router-dom";
import Message from "./Message";
import { TextBar } from "../my-components/TextBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect } from "react";
import { motion } from "framer-motion";

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

  const {
    data: messages,
    error,
    isLoading,
  } = useQuery<Message[], Error>({
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
          queryClient.setQueryData<Message[]>(
            ["fetchMessages", id],
            (oldData) => {
              return oldData?.map(
                (message) =>
                  message.id === payload.new.id
                    ? (payload.new as Message)
                    : message // Assert payload.new as Message
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
  }, [queryClient, id]);


  return (
    <div className="h-[80%] w-[82%] mt-24">
      <motion.section
        className="h-[94%] flex-col pt-2 overflow-auto pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <div className="flex flex-col">
          {messages?.map((item) => (
            <Message
              key={item.id}
              id={item.id}
              position={item?.user_id === user?.id ? "right" : "left"}
              message={item.message}
              created_at={item.created_at}
              is_liked={item.is_liked}
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
                  first to start the conversation! Type a message below and hit
                  send to break the silence. 😊
                </p>
              </div>
            </section>
          )}
        </div>
      </motion.section>
      <TextBar />
    </div>
  );
};
