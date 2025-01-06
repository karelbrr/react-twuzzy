import { FindNewPeople } from "./FindNewPeople";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "./createClient";
import { ChatRequest as Chat } from "./types";
import { useQuery } from "@tanstack/react-query";

export const SideBar = () => {
  const { user } = useAuth();

  const fetchChats = async (): Promise<Chat[]> => {
    const { data: myChatsData, error } = await supabase
      .from("chats")
      .select(
        `
      *,
      chat_members!inner(
        user_id, 
        profiles!inner(
          id, 
          first_name, 
          last_name
        )
      )
    `
      )
      .eq("is_started", true)
      .neq("chat_members.user_id", user?.id);

    if (error) throw new Error(error.message);

    console.log(myChatsData);

    return myChatsData;
  };

  const {
    data: myChats,
    error: errorQuery,
    isLoading,
  } = useQuery<Chat[], Error>({
    queryKey: ["myChatsData"],
    queryFn: fetchChats,
  });
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="h-screen w-[18%]  fixed border-r"
    >
      <div className="flex justify-between">
        <h3 className=" font-bold text-2xl m-auto w-4/5  mt-5 ml-5">Chats</h3>

        <FindNewPeople />
      </div>

      <div className="m-auto w-[90%] mt-4 ">
        {myChats?.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className=" w-full flex justify-start h-14 mb-3"
          >
            <Avatar className="size-10 max-h-12 max-w-12">
              <AvatarImage />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            {item.chat_members.map((member) => (
              <p key={member.user_id}>
              
                {member.profiles.first_name} {member.profiles.last_name}
              </p>
            ))}
          </Button>
        ))}
      </div>
    </motion.section>
  );
};
