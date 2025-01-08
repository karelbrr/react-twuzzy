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
  replied_to: string;
}

export const Content = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const fetchMessages = async (): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["fetchMessages"],
    queryFn: fetchMessages,
  });

  return (
    <div className="h-[80%] w-[82%]">
      <section className="h-[96%] flex-col pt-2">
        <div className="flex flex-col">
          {data?.map((item) => (
            <Message key={item.id}
              position={item?.user_id === user?.id ? "right" : "left"}
              message={item.message}
            />
          ))}
        </div>
      </section>
      <TextBar />
    </div>
  );
};
