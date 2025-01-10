import { FindNewPeople } from "./FindNewPeople";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "./createClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Error as ErrorDiv } from "./Error";
import { Skeleton } from "@/components/ui/skeleton";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Chat {
  id: string;
  created_at: string;
  updated_at: string;
  is_started: boolean;
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  chat_with: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

export const SideBar = () => {
  const { user } = useAuth();

  const fetchChats = async (): Promise<Chat[]> => {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
    *,
    created_by: profiles!created_by (id,first_name, last_name, avatar),
    chat_with: profiles!chat_with (id,first_name, last_name, avatar)
  `
      )
      .eq("is_started", true)
      .or(`created_by.eq.${user?.id},chat_with.eq.${user?.id}`);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const {
    data: myChats,
    error: errorQuery,
    isLoading,
  } = useQuery<Chat[], Error>({
    queryKey: ["Chats"],
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
            asChild
            key={item.id}
            variant="outline"
            className="w-full flex justify-start  h-16 mb-3"
          >
            <Link to={`chat/${item.id}`}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center ">
                  <Avatar className="size-10 max-h-12 max-w-12 ml-2">
                    <AvatarImage />
                    <AvatarFallback>
                      {item.created_by.id === user?.id
                        ? item.chat_with.first_name?.substring(0, 1) || ""
                        : item.created_by.first_name?.substring(0, 1) || ""}
                      {item.created_by.id === user?.id
                        ? item.chat_with.last_name?.substring(0, 1) || ""
                        : item.created_by.last_name?.substring(0, 1) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <p className="ml-2">
                    {item.created_by.id === user?.id
                      ? item.chat_with.first_name
                      : item.created_by.first_name}{" "}
                    {item.created_by.id === user?.id
                      ? item.chat_with.last_name
                      : item.created_by.last_name}
                  </p>
                </div>
                <div className="">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis className="mt-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {item.created_by.id === user?.id
                          ? item.chat_with.first_name
                          : item.created_by.first_name}{" "}
                        {item.created_by.id === user?.id
                          ? item.chat_with.last_name
                          : item.created_by.last_name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={`/profile/${item.created_by.id === user?.id
                          ? item.chat_with.id
                          : item.created_by.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-700 focus:text-red-700">
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-700 focus:text-red-700">
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Link>
          </Button>
        ))}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </div>
        )}
        {errorQuery && <ErrorDiv error={errorQuery?.message} />}
      </div>
    </motion.section>
  );
};
