import { useParams } from "react-router-dom";
import Message from "./Message";
import { TextBar } from "../my-components/TextBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "./createClient";
import { useAuth } from "@/auth/AuthProvider";

interface Message {
  id: string;
  created_at: string;
  chat_id: string;
  user_id: string;
  message: string;
  media_url: string;
  is_read: boolean;
  is_liked:boolean;
  replied_to: string;
}

export const Content = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const fetchMessages = async (): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id)
      .order("created_at", { ascending: true  });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const { data, error, isLoading } = useQuery<Message[], Error>({
    queryKey: ["fetchMessages"],
    queryFn: fetchMessages,
  });

  return (
    <div className="h-[80%] w-[82%] mt-24   ">
      <section className="h-[94%] flex-col pt-2 overflow-auto pb-4">
        <div className="flex flex-col">
          {data?.map((item) => (
            <Message
              key={item.id}
              position={item?.user_id === user?.id ? "right" : "left"}
              message={item.message}
              created_at={item.created_at}
              is_liked={item.is_liked}
            />
          ))}

          {data?.length === 0 && (
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
      </section>
      <TextBar />
    </div>
  );
};
