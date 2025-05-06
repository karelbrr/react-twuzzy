import { Ellipsis, MailQuestion } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Check, X, User, Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { GroupRequest } from "./GroupComponents/GroupRequest";

export interface ChatRequest {
  id: string;
  created_at: string;
  updated_at: string;
  is_started: boolean;
  created_by: string;
  chat_with: string;
}

export function MyChatRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [labelCount, setLabelCount] = useState<number>();

  // 🔹 Načtení chat requestů
  const fetchChatRequests = async () => {
    const { data: blocked, error: blockedError } = await supabase
      .from("blocked_users")
      .select("blocked_id")
      .eq("blocker_id", user?.id);

    if (blockedError) throw new Error(blockedError.message);

    const blockedIds = blocked?.map((entry) => entry.blocked_id) || [];
    const blockedIdsString = `(${blockedIds.join(",")})`;

    const { data, error } = await supabase
      .from("chats")
      .select(
        `
          *,
          profiles:created_by (
            id,
            first_name,
            last_name,
            avatar
          )
        `
      )
      .eq("is_started", false)
      .eq("chat_with", user?.id)
      .not("created_by", "in", blockedIdsString); // Vyloučíme blokované

    if (error) throw new Error(error.message);
    setLabelCount(labelCount || 0 + data?.length);
    return data;
  };

  const {
    data: myRequestsData,
    error: errorQuery,
    isLoading,
  } = useQuery({
    queryKey: ["ChatRequest"],
    queryFn: fetchChatRequests,
  });

  // 🔹 Funkce pro akceptaci requestu
  const acceptRequest = async (chatId: string) => {
    const { data, error } = await supabase
      .from("chats")
      .update({ is_started: true })
      .eq("id", chatId);

    if (error) throw new Error(error.message);
    return data;
  };

  // 🔹 Mutace s invalidací cache
  const { mutate, isPending } = useMutation({
    mutationFn: acceptRequest,
    onError: () => console.log("error"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRequests"] });
      queryClient.invalidateQueries({ queryKey: ["fetchChats"] });
    },
  });

  const sendAcceptRequest = (chatId: string) => {
    mutate(chatId);
  };

  useEffect(() => {
    const subscription = supabase
      .channel("realtime:chats")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        () => {
          queryClient.invalidateQueries(["chatRequests"]);
          queryClient.invalidateQueries(["fetchChats"]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chats" },
        () => {
          queryClient.invalidateQueries(["chatRequests"]);
          queryClient.invalidateQueries(["fetchChats"]);
          console.log("update");
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chats" },
        () => {
          queryClient.invalidateQueries(["chatRequests"]);
          queryClient.invalidateQueries(["fetchChats"]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, user?.id]); // Přidáno user?.id jako závislost

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative">
          <MailQuestion />
          {myRequestsData && myRequestsData.length > 0 ? (
            <div className="absolute bottom-1 left-2 w-4 h-4 bg-white text-black rounded-full flex items-center justify-center text-xs">
              <p>{labelCount}</p>
            </div>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat requests</DialogTitle>
          <DialogDescription>
            Manage your chat requests with accept, decline, or view details of
            users who want to connect with you.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className=" max-h-[200px] w-full ">
          <h3 className="font-semibold">Chats</h3>
          {errorQuery && (
            <div className="border border-red-700 mt-2 p-3 text-red-700 rounded-lg">
              <h4>Error</h4>
              <p>{errorQuery.message}</p>
            </div>
          )}

          {isLoading && <Skeleton className="w-full h-6" />}
          <div className="space-y-2">
            {myRequestsData?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border p-2 rounded-lg"
              >
                <p className="text-sm">
                  {item.profiles.first_name} {item.profiles.last_name}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis size={17} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      <p>
                        {item.profiles.first_name} {item.profiles.last_name}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => sendAcceptRequest(item.id)}
                    >
                      <Check size={16} /> Accept Request
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <X size={16} /> Decline Request
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/profile/${item.profiles.id}`}>
                        <User size={16} /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-700 focus:text-red-700">
                      <Ban size={16} /> Block
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className=" max-h-[200px] w-full ">
          <GroupRequest/>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
