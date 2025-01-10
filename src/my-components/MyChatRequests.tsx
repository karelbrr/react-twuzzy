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
import { supabase } from "./createClient";
import { useAuth } from "@/auth/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { log } from "console";

interface Profiles {
  first_name: string;
  last_name: string;
  avatar: string;
}
export interface ChatRequest {
  id: string;
  created_at: string;
  updated_at: string;
  is_started: boolean;
  created_by: string;
  chat_with: string;
}

export function MyChatRequests({}) {
  const { user } = useAuth();
  const fetchChatRequests = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
      *,
      profiles!created_by (
        id,
        first_name,
        last_name,
        avatar
      )
    `
      )
      .eq("is_started", false)
      .eq("chat_with", user?.id);

    if (error) {
      throw new Error(error.message);
    }

   

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

  const acceptRequest = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .update({ is_started: true })
        .eq("id", chatId);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Chat request accepted", data);
      return data;
      ;

    } catch (error) {
      console.error("Error accepting request:", error);
      throw error;
    }
  };
  const { mutate, isPending, error } = useMutation({
    mutationFn: acceptRequest,
    onError: () => {
      console.log(error);

    },
    onSuccess: () => {
      console.log("test");

    }
  });

  const sendAcceptRequest = (chatId: string) => {
    mutate(chatId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          <MailQuestion />
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
        <ScrollArea className="max-h-[200px] w-full">
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
                     <DropdownMenuItem onClick={() => sendAcceptRequest(item.id)}>Accept Request</DropdownMenuItem>
                    <DropdownMenuItem>Decline Request</DropdownMenuItem>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-700 focus:text-red-700">
                      Block
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
