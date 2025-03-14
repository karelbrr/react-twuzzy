import { useAuth } from "@/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useParams } from "react-router-dom";
import { supabase } from "./my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Error as ErrorDiv } from "./Error";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

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
    username: string;
  };
  chat_with: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
    username: string;
  };
}

export function ProfileDescInContent() {
  const { user } = useAuth();
  const { id } = useParams();
  const fetchChats = async (): Promise<Chat> => {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
    *,
    created_by: profiles!created_by (id,first_name, last_name, avatar,username),
    chat_with: profiles!chat_with (id,first_name, last_name, avatar,username)
  `
      )
      .eq("id", id)
      .or(`created_by.eq.${user?.id},chat_with.eq.${user?.id}`)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<Chat, Error>({
    queryKey: ["fetchProfileDataFromChats", id],
    queryFn: fetchChats,
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="flex flex-col justify-center items-center mb-5"
    >
      <Helmet>
        {isLoading ? (
          <title>chatname | Twüzzy</title>
        ) : (
          <title>
            {data?.created_by.id === user?.id
              ? `${data?.chat_with.first_name}${" "}${
                  data?.chat_with.last_name
                }`
              : `${data?.created_by.first_name}${" "}${
                  data?.created_by.last_name
                }`}{" "}
            | Twüzzy
          </title>
        )}
      </Helmet>
      {isLoading ? (
        <Skeleton className="size-32 rounded-full mt-7" />
      ) : (
        <Link
          to={`/profile/${
            data?.created_by.id === user?.id
              ? data?.chat_with.id
              : data?.created_by.id
          }`}
        >
          <Avatar className="size-32 mt-7">
            <AvatarImage
              src={
                data?.created_by.id === user?.id
                  ? data?.chat_with.avatar
                  : data?.created_by.avatar
              }
              alt="pfp"
            />
            <AvatarFallback className="text-3xl">
              {data?.created_by.id === user?.id
                ? data?.chat_with.first_name?.substring(0, 1) || ""
                : data?.created_by.first_name?.substring(0, 1) || ""}
              {data?.created_by.id === user?.id
                ? data?.chat_with.last_name?.substring(0, 1) || ""
                : data?.created_by.last_name?.substring(0, 1) || ""}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}
      {isLoading ? (
        <div className="flex mb-5 mt-5 space-x-2">
          <Skeleton className="h-5 w-20" /> <Skeleton className="h-5 w-32" />{" "}
        </div>
      ) : (
        <Button
          asChild
          variant={"link"}
          className="text-center  mt-5 text-xl font-semibold"
        >
          <Link
            to={`/profile/${
              data?.created_by.id === user?.id
                ? data?.chat_with.id
                : data?.created_by.id
            }`}
          >
            {data?.created_by.id === user?.id
              ? data?.chat_with.first_name
              : data?.created_by.first_name}{" "}
            {data?.created_by.id === user?.id
              ? data?.chat_with.last_name
              : data?.created_by.last_name}
          </Link>
        </Button>
      )}

      <h3 className="text-sm opacity-65">
        @
        {data?.created_by.id === user?.id
          ? data?.chat_with.username
          : data?.created_by.username}
      </h3>

      {errorQuery && <ErrorDiv error={errorQuery?.message} />}
    </motion.div>
  );
}
